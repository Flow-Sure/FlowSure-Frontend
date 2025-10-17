'use client';

import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, DollarSign, Vault } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { metricsApi, transactionApi } from '@/lib/api-client';
import { useWalletStore } from '@/store/wallet-store';

export function DashboardPage() {
  const { user } = useWalletStore();

  const { data: vaultData } = useQuery({
    queryKey: ['vault-metrics'],
    queryFn: () => metricsApi.getVault(),
    enabled: !!user?.loggedIn,
  });

  const { data: protectionData } = useQuery({
    queryKey: ['protection-metrics'],
    queryFn: () => metricsApi.getProtection(),
    enabled: !!user?.loggedIn,
  });

  const { data: userActionsData } = useQuery({
    queryKey: ['user-actions', user?.addr],
    queryFn: () => transactionApi.getUserActions(user.addr!),
    enabled: !!user?.addr,
    refetchInterval: 5000,
  });

  const actions = userActionsData?.data?.actions || [];
  const stats = userActionsData?.data?.stats || { pending: 0, success: 0, failed: 0 };

  const activeProtections = actions.filter((a: any) => a.status === 'PENDING' || a.status === 'RETRYING');
  const retryQueue = actions.filter((a: any) => a.status === 'RETRYING');
  const compensations = actions.filter((a: any) => a.status === 'COMPENSATED');

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your protected transactions and vault status</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Protections</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProtections.length}</div>
              <p className="text-xs text-muted-foreground">Transactions protected</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Retry Queue</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{retryQueue.length}</div>
              <p className="text-xs text-muted-foreground">Pending retries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{compensations.length * 5} FLOW</div>
              <p className="text-xs text-muted-foreground">From compensations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vault Balance</CardTitle>
              <Vault className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,250 FLOW</div>
              <p className="text-xs text-muted-foreground">Available for claims</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Active Protections</CardTitle>
              <CardDescription>Your currently protected transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeProtections.map((action: any) => (
                  <div key={action.actionId} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="font-medium">{action.actionType}</p>
                      <p className="text-sm text-muted-foreground">{formatTimestamp(action.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{action.amount} FLOW</p>
                      <Badge variant="default">{action.status}</Badge>
                    </div>
                  </div>
                ))}
                {activeProtections.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No active protections</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Retry Queue</CardTitle>
              <CardDescription>Transactions being retried</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {retryQueue.map((action: any) => (
                  <div key={action.actionId} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="font-medium">{action.actionType}</p>
                      <p className="text-sm text-muted-foreground">Attempt {action.retries}/{action.maxRetries}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{action.amount} FLOW</p>
                      <Badge variant="secondary">Retrying</Badge>
                    </div>
                  </div>
                ))}
                {retryQueue.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No pending retries</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Claims & Compensations</CardTitle>
            <CardDescription>Your compensation history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {compensations.map((action: any) => (
                <div key={action.actionId} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">Compensation - {action.actionType}</p>
                    <p className="text-sm text-muted-foreground">{formatTimestamp(action.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">5.0 FLOW</p>
                    <Badge variant="outline">Compensated</Badge>
                  </div>
                </div>
              ))}
              {compensations.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No compensations yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
