'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';

// Dynamically import Web3Provider with no SSR to avoid indexedDB errors
const Web3Provider = dynamic(
  () => import('@/components/providers/web3-provider').then((mod) => mod.Web3Provider),
  { ssr: false }
);

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <Web3Provider>
        <Toaster position="top-center" />
        {children}
      </Web3Provider>
    </ThemeProvider>
  );
}

