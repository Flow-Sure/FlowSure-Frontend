'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, Coins, Send, Shield, Percent } from 'lucide-react';
import { useWalletStore } from '@/store/wallet-store';
import { toast } from 'sonner';

type ActionType = 'swap' | 'mint' | 'transfer';

export function InsurePage() {
  const { user } = useWalletStore();
  const [actionType, setActionType] = useState<ActionType>('swap');
  const [amount, setAmount] = useState('');
  const [retries, setRetries] = useState('3');
  const [frothStaked, setFrothStaked] = useState(1500);

  const baseFee = parseFloat(amount) * 0.02 || 0;
  const discount = Math.min(frothStaked / 100, 20);
  const finalFee = baseFee * (1 - discount / 100);
  const savings = baseFee - finalFee;

  const handleExecute = () => {
    if (!user.loggedIn) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    toast.success('Protected transaction initiated!');
  };

  const actionIcons = {
    swap: ArrowRightLeft,
    mint: Coins,
    transfer: Send,
  };

  const ActionIcon = actionIcons[actionType];

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Insure Transaction</h1>
          <p className="text-muted-foreground">Wrap your transaction with automatic retry protection</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card 
            className={`cursor-pointer transition-all ${actionType === 'swap' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setActionType('swap')}
          >
            <CardHeader className="text-center">
              <ArrowRightLeft className="h-8 w-8 mx-auto mb-2" />
              <CardTitle>Swap</CardTitle>
              <CardDescription>Token exchanges</CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${actionType === 'mint' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setActionType('mint')}
          >
            <CardHeader className="text-center">
              <Coins className="h-8 w-8 mx-auto mb-2" />
              <CardTitle>Mint</CardTitle>
              <CardDescription>NFT minting</CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${actionType === 'transfer' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setActionType('transfer')}
          >
            <CardHeader className="text-center">
              <Send className="h-8 w-8 mx-auto mb-2" />
              <CardTitle>Transfer</CardTitle>
              <CardDescription>Asset transfers</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ActionIcon className="h-5 w-5" />
                Transaction Parameters
              </CardTitle>
              <CardDescription>Configure your protected transaction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="action-type">Action Type</Label>
                <Select value={actionType} onValueChange={(value) => setActionType(value as ActionType)}>
                  <SelectTrigger id="action-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="swap">Swap</SelectItem>
                    <SelectItem value="mint">Mint</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (FLOW)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="retries">Max Retries</Label>
                <Select value={retries} onValueChange={setRetries}>
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

              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient (optional)</Label>
                <Input
                  id="recipient"
                  type="text"
                  placeholder="0x..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Fee Calculator
              </CardTitle>
              <CardDescription>Insurance cost with FROTH discount</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Base Fee (2%)</span>
                  <span className="font-bold">{baseFee.toFixed(4)} FLOW</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    <span className="text-sm font-medium">FROTH Discount</span>
                  </div>
                  <Badge variant="default">{discount.toFixed(1)}%</Badge>
                </div>

                <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">You Save</span>
                  <span className="font-bold text-green-700 dark:text-green-300">
                    {savings.toFixed(4)} FLOW
                  </span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Final Fee</span>
                    <span className="text-2xl font-bold">{finalFee.toFixed(4)} FLOW</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Your FROTH Staked</span>
                  <span className="font-medium">{frothStaked} FROTH</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Max Retries</span>
                  <span className="font-medium">{retries}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Gas</span>
                  <span className="font-medium">0.001 FLOW</span>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleExecute}
                disabled={!user.loggedIn || !amount}
              >
                <Shield className="h-4 w-4 mr-2" />
                Execute Protected Transaction
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Configure Protection</h4>
                  <p className="text-sm text-muted-foreground">
                    Set your transaction parameters and retry limits
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Auto Retry</h4>
                  <p className="text-sm text-muted-foreground">
                    If transaction fails, we automatically retry up to your limit
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Get Compensated</h4>
                  <p className="text-sm text-muted-foreground">
                    If all retries fail, receive compensation from the vault
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
