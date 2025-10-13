'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Coins, Wallet, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWalletStore } from '@/store/wallet-store';
import { fcl } from '@/lib/flow-config';
import { useEffect } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Shield },
  { href: '/froth', label: 'FROTH Staking', icon: Coins },
  { href: '/dapper', label: 'Dapper Protection', icon: Wallet },
  { href: '/insure', label: 'Insure Transaction', icon: FileCheck },
];

export function Navigation() {
  const pathname = usePathname();
  const { user, setUser, logout } = useWalletStore();

  useEffect(() => {
    fcl.currentUser.subscribe((currentUser: any) => {
      setUser({
        addr: currentUser.addr,
        loggedIn: currentUser.loggedIn,
      });
    });
  }, [setUser]);

  const handleConnect = async () => {
    await fcl.authenticate();
  };

  const handleDisconnect = async () => {
    await fcl.unauthenticate();
    logout();
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">FlowSure</span>
            </Link>
            <div className="hidden md:flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className="gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user.loggedIn ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {user.addr?.slice(0, 6)}...{user.addr?.slice(-4)}
                </span>
                <Button variant="outline" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </>
            ) : (
              <Button onClick={handleConnect}>Connect Wallet</Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
