'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Navigation } from './navigation';
import { FloMascot } from './flo-mascot';
import { useMascotStore } from '@/store/mascot-store';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, message, setState } = useMascotStore();

  useEffect(() => {
    if (pathname === '/froth') {
      setState('froth');
    } else if (pathname === '/dapper') {
      setState('dapper');
    } else {
      setState('idle');
    }
  }, [pathname, setState]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <FloMascot state={state} message={message} />
    </div>
  );
}
