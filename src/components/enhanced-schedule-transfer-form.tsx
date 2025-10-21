'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Shield, Users, Repeat, AlertCircle, X, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { scheduledTransfersApi, CreateScheduledTransferRequest, Recipient } from '@/lib/api/scheduled-transfers';
import { recipientListsApi } from '@/lib/api/recipient-lists';
import { useWalletStore } from '@/store/wallet-store';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authorizeScheduledTransfers, checkAuthorization } from '@/lib/scheduled-transfer-auth';

interface EnhancedScheduleTransferFormProps {
  onSuccess?: () => void;
  selectedDate?: Date;
}

export function EnhancedScheduleTransferForm({ onSuccess, selectedDate }: EnhancedScheduleTransferFormProps) {
  const { user } = useWalletStore();
  const queryClient = useQueryClient();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [recipientMode, setRecipientMode] = useState<'single' | 'multiple' | 'list'>('single');
  const [singleRecipient, setSingleRecipient] = useState('');
  const [multipleRecipients, setMultipleRecipients] = useState<Recipient[]>([{ address: '', name: '' }]);
  const [selectedListId, setSelectedListId] = useState('');
  const [amount, setAmount] = useState('');
  const [amountPerRecipient, setAmountPerRecipient] = useState(true);
  const [date, setDate] = useState(selectedDate ? selectedDate.toISOString().split('T')[0] : '');
  const [time, setTime] = useState('12:00');
  const [retryLimit, setRetryLimit] = useState('3');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [recurringEndDate, setRecurringEndDate] = useState('');
  const [costEstimate, setCostEstimate] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const { data: listsData } = useQuery({
    queryKey: ['recipient-lists', user?.addr],
    queryFn: () => recipientListsApi.getByUser(user!.addr!),
    enabled: !!user?.addr && recipientMode === 'list',
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateScheduledTransferRequest) => scheduledTransfersApi.create(data),
    onSuccess: () => {
      toast.success(isRecurring ? 'Recurring transfer scheduled successfully!' : 'Transfer scheduled successfully!');
      queryClient.invalidateQueries({ queryKey: ['scheduled-transfers'] });
      resetForm();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to schedule transfer');
    },
  });

  const lists = listsData?.data || [];

  const getRecipientCount = () => {
    if (recipientMode === 'single') return 1;
    if (recipientMode === 'multiple') return multipleRecipients.filter(r => r.address.trim()).length;
    if (recipientMode === 'list' && selectedListId) {
      const list = lists.find(l => (l._id || l.id) === selectedListId);
      return list?.recipients.length || 0;
    }
    return 0;
  };

  const calculateCost = async () => {
    if (!amount || !date || !isRecurring) return;

    const recipientCount = getRecipientCount();
    if (recipientCount === 0) return;

    try {
      const scheduledDateTime = new Date(`${date}T${time}:00`);
      const result = await scheduledTransfersApi.calculateRecurringCost({
        amount: parseFloat(amount),
        amountPerRecipient,
        recipientCount,
        startDate: scheduledDateTime.toISOString(),
        frequency: recurringFrequency,
        endDate: recurringEndDate ? new Date(`${recurringEndDate}T23:59:59`).toISOString() : undefined,
      });
      setCostEstimate(result.data);
    } catch (error) {
      console.error('Failed to calculate cost:', error);
    }
  };

  useEffect(() => {
    if (isRecurring) {
      calculateCost();
    }
  }, [amount, recipientMode, selectedListId, multipleRecipients, amountPerRecipient, date, time, recurringFrequency, recurringEndDate, isRecurring]);

  useEffect(() => {
    const checkAuth = async () => {
      if (user?.addr) {
        setIsCheckingAuth(true);
        try {
          const authorized = await checkAuthorization(user.addr);
          setIsAuthorized(authorized);
        } catch (error) {
          console.error('Failed to check authorization:', error);
          setIsAuthorized(false);
        } finally {
          setIsCheckingAuth(false);
        }
      }
    };
    checkAuth();
  }, [user?.addr]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setRecipientMode('single');
    setSingleRecipient('');
    setMultipleRecipients([{ address: '', name: '' }]);
    setSelectedListId('');
    setAmount('');
    setAmountPerRecipient(true);
    setDate(selectedDate ? selectedDate.toISOString().split('T')[0] : '');
    setTime('12:00');
    setRetryLimit('3');
    setIsRecurring(false);
    setRecurringFrequency('weekly');
    setRecurringEndDate('');
    setCostEstimate(null);
  };

  const addRecipientField = () => {
    setMultipleRecipients([...multipleRecipients, { address: '', name: '' }]);
  };

  const removeRecipientField = (index: number) => {
    setMultipleRecipients(multipleRecipients.filter((_, i) => i !== index));
  };

  const updateRecipientField = (index: number, field: 'address' | 'name', value: string) => {
    const updated = [...multipleRecipients];
    updated[index][field] = value;
    setMultipleRecipients(updated);
  };

  const handleAuthorize = async () => {
    if (!user?.addr) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsAuthorizing(true);
    try {
      const maxAmount = 10000; // 10,000 FLOW max per transfer
      const expiryDays = 365; // 1 year
      
      toast.loading('Please sign the authorization transaction...');
      await authorizeScheduledTransfers(maxAmount, expiryDays);
      
      setIsAuthorized(true);
      toast.success('Authorization successful! You can now schedule transfers.');
    } catch (error: any) {
      console.error('Authorization failed:', error);
      toast.error(error.message || 'Failed to authorize scheduled transfers');
    } finally {
      setIsAuthorizing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.addr) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!isAuthorized) {
      toast.error('Please authorize scheduled transfers first');
      return;
    }

    if (!title || !amount || !date) {
      toast.error('Please fill in all required fields');
      return;
    }

    const scheduledDateTime = new Date(`${date}T${time}:00`);
    if (scheduledDateTime <= new Date()) {
      toast.error('Scheduled date must be in the future');
      return;
    }

    let requestData: CreateScheduledTransferRequest = {
      userAddress: user.addr,
      title,
      description,
      amount: parseFloat(amount),
      amountPerRecipient,
      scheduledDate: scheduledDateTime.toISOString(),
      retryLimit: parseInt(retryLimit),
      isRecurring,
    };

    if (isRecurring) {
      requestData.recurringFrequency = recurringFrequency;
      if (recurringEndDate) {
        requestData.recurringEndDate = new Date(`${recurringEndDate}T23:59:59`).toISOString();
      }
    }

    if (recipientMode === 'single') {
      if (!singleRecipient) {
        toast.error('Please enter a recipient address');
        return;
      }
      requestData.recipient = singleRecipient;
    } else if (recipientMode === 'multiple') {
      const validRecipients = multipleRecipients.filter(r => r.address.trim());
      if (validRecipients.length === 0) {
        toast.error('Please add at least one recipient');
        return;
      }
      requestData.recipients = validRecipients;
    } else if (recipientMode === 'list') {
      if (!selectedListId) {
        toast.error('Please select a recipient list');
        return;
      }
      requestData.recipientListId = selectedListId;
    }

    createMutation.mutate(requestData);
  };

  const recipientCount = getRecipientCount();
  const totalAmount = amountPerRecipient 
    ? parseFloat(amount || '0') * recipientCount 
    : parseFloat(amount || '0');
  const baseFee = totalAmount * 0.02;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Enhanced Transfer Scheduling
        </CardTitle>
        <CardDescription>
          Schedule transfers with batch payouts, recipient lists, and recurring options
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isAuthorized && !isCheckingAuth && (
          <Alert className="mb-6">
            <Shield className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <p className="font-medium mb-1">Authorization Required</p>
                <p className="text-sm text-muted-foreground">
                  You need to authorize FlowSure to execute scheduled transfers on your behalf.
                  This is a one-time setup that allows the backend to transfer FLOW tokens from your wallet
                  at the scheduled time.
                </p>
              </div>
              <Button
                type="button"
                onClick={handleAuthorize}
                disabled={isAuthorizing}
                className="ml-4"
              >
                {isAuthorizing ? 'Authorizing...' : 'Authorize Now'}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {isAuthorized && (
          <Alert className="mb-6 border-green-500 bg-green-50">
            <Shield className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <p className="font-medium text-green-900">Authorized ✓</p>
              <p className="text-sm text-green-700">
                Your wallet is authorized for scheduled transfers. You can now schedule transfers up to 10,000 FLOW.
              </p>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Monthly Team Payout, Token Giveaway"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Add notes about this transfer"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <Label>Recipients *</Label>
            <Tabs value={recipientMode} onValueChange={(v) => setRecipientMode(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="single">Single</TabsTrigger>
                <TabsTrigger value="multiple">Multiple</TabsTrigger>
                <TabsTrigger value="list">
                  <Users className="h-4 w-4 mr-2" />
                  List
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="single" className="space-y-2">
                <Input
                  placeholder="Recipient wallet address"
                  value={singleRecipient}
                  onChange={(e) => setSingleRecipient(e.target.value)}
                />
              </TabsContent>
              
              <TabsContent value="multiple" className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Add multiple recipients for batch payout</p>
                  <Button type="button" variant="outline" size="sm" onClick={addRecipientField}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                {multipleRecipients.map((recipient, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Wallet Address *"
                      value={recipient.address}
                      onChange={(e) => updateRecipientField(index, 'address', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Name (optional)"
                      value={recipient.name || ''}
                      onChange={(e) => updateRecipientField(index, 'name', e.target.value)}
                      className="flex-1"
                    />
                    {multipleRecipients.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRecipientField(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="list" className="space-y-2">
                {lists.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No recipient lists found. Create one in the Recipient Lists section.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Select value={selectedListId} onValueChange={setSelectedListId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a recipient list" />
                    </SelectTrigger>
                    <SelectContent>
                      {lists.map((list) => (
                        <SelectItem key={list._id || list.id} value={list._id || list.id!}>
                          {list.name} ({list.recipients.length} recipients)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {recipientCount > 1 && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="amount-mode" className="text-sm font-medium">
                  Amount per recipient
                </Label>
                <p className="text-xs text-muted-foreground">
                  {amountPerRecipient 
                    ? 'Each recipient will receive the specified amount' 
                    : 'Total amount will be split equally among recipients'}
                </p>
              </div>
              <Switch
                id="amount-mode"
                checked={amountPerRecipient}
                onCheckedChange={setAmountPerRecipient}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">
              Amount (FLOW) * {recipientCount > 1 && (
                <span className="text-muted-foreground font-normal">
                  {amountPerRecipient ? '(per recipient)' : '(total)'}
                </span>
              )}
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            {recipientCount > 1 && (
              <p className="text-sm text-muted-foreground">
                Total: {totalAmount.toFixed(2)} FLOW for {recipientCount} recipients
              </p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time *
              </Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="recurring" className="flex items-center gap-2 text-base">
                  <Repeat className="h-4 w-4" />
                  Recurring Transfer
                </Label>
                <p className="text-sm text-muted-foreground">
                  Automatically schedule future transfers
                </p>
              </div>
              <Switch
                id="recurring"
                checked={isRecurring}
                onCheckedChange={setIsRecurring}
              />
            </div>

            {isRecurring && (
              <div className="space-y-4 pt-4 border-t">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency *</Label>
                    <Select value={recurringFrequency} onValueChange={(v: any) => setRecurringFrequency(v)}>
                      <SelectTrigger id="frequency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date (Optional)</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={recurringEndDate}
                      onChange={(e) => setRecurringEndDate(e.target.value)}
                      min={date}
                    />
                  </div>
                </div>

                {costEstimate && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <p className="font-medium">Cost Estimate:</p>
                        <p className="text-sm">
                          • {costEstimate.occurrences} transfers scheduled
                        </p>
                        <p className="text-sm">
                          • {costEstimate.costPerTransfer.toFixed(2)} FLOW per transfer
                        </p>
                        <p className="text-sm font-medium">
                          • Total: {costEstimate.totalCost.toFixed(2)} FLOW
                          {costEstimate.estimatedOnly && ' (estimated for 1 year)'}
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="retries">Max Retries</Label>
            <Select value={retryLimit} onValueChange={setRetryLimit}>
              <SelectTrigger id="retries">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 retry</SelectItem>
                <SelectItem value="2">2 retries</SelectItem>
                <SelectItem value="3">3 retries</SelectItem>
                <SelectItem value="5">5 retries</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-blue-900 dark:text-blue-100 font-medium">
              <Shield className="h-4 w-4" />
              Auto-Protection Enabled
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <div className="flex justify-between">
                <span>Transfer Amount:</span>
                <span className="font-medium">{totalAmount.toFixed(4)} FLOW</span>
              </div>
              <div className="flex justify-between">
                <span>Insurance Fee (2%):</span>
                <span className="font-medium">{baseFee.toFixed(4)} FLOW</span>
              </div>
              {recipientCount > 1 && (
                <div className="flex justify-between">
                  <span>Recipients:</span>
                  <Badge variant="secondary">{recipientCount}</Badge>
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={createMutation.isPending || !user?.loggedIn}
          >
            {createMutation.isPending ? 'Scheduling...' : isRecurring ? 'Schedule Recurring Transfer' : 'Schedule Transfer'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
