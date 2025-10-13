'use client';

import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, DollarSign, Vault } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { metricsApi } from '@/lib/api-client';
import { useWalletStore } from '@/store/wallet-store';

export function DashboardPage() {
  const { user } = useWalletStore();

  const { data: vaultData } = useQuery({
    queryKey: ['vault-metrics'],
    queryFn: () => metricsApi.getVault(),
    enabled: user.loggedIn,
  });

  const { data: protectionData } = useQuery({
    queryKey: ['protection-metrics'],
    queryFn: () => metricsApi.getProtection(),
    enabled: user.loggedIn,
  });

  const mockProtections = [
    { id: 1, type: 'Swap', status: 'active', amount: '100 FLOW', timestamp: '2 hours ago' },
    { id: 2, type: 'Mint', status: 'active', amount: '50 FLOW', timestamp: '5 hours ago' },
  ];

  const mockRetryQueue = [
    { id: 1, type: 'Transfer', attempts: 2, nextRetry: '00:45', amount: '25 FLOW' },
  ];

  const mockClaims = [
    { id: 1, type: 'Compensation', amount: '10 FLOW', status: 'completed', timestamp: '1 day ago' },
  ];

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
              <div className="text-2xl font-bold">{mockProtections.length}</div>
              <p className="text-xs text-muted-foreground">Transactions protected</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Retry Queue</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockRetryQueue.length}</div>
              <p className="text-xs text-muted-foreground">Pending retries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45 FLOW</div>
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
                {mockProtections.map((protection) => (
                  <div key={protection.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="font-medium">{protection.type}</p>
                      <p className="text-sm text-muted-foreground">{protection.timestamp}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{protection.amount}</p>
                      <Badge variant="default">{protection.status}</Badge>
                    </div>
                  </div>
                ))}
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
                {mockRetryQueue.map((retry) => (
                  <div key={retry.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="font-medium">{retry.type}</p>
                      <p className="text-sm text-muted-foreground">Attempt {retry.attempts}/3</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{retry.amount}</p>
                      <Badge variant="secondary">Next: {retry.nextRetry}</Badge>
                    </div>
                  </div>
                ))}
                {mockRetryQueue.length === 0 && (
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
              {mockClaims.map((claim) => (
                <div key={claim.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">{claim.type}</p>
                    <p className="text-sm text-muted-foreground">{claim.timestamp}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{claim.amount}</p>
                    <Badge variant="outline">{claim.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
