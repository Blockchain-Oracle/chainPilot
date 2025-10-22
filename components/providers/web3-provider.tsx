'use client';

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  sepolia,
  base,
  baseSepolia,
  arbitrum,
  arbitrumSepolia,
  optimism,
  optimismSepolia,
  polygon,
  polygonAmoy,
} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

// Configure chains and providers
const config = getDefaultConfig({
  appName: 'ChainPilot',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'your-project-id',
  chains: [
    mainnet,
    sepolia,
    base,
    baseSepolia,
    arbitrum,
    arbitrumSepolia,
    optimism,
    optimismSepolia,
    polygon,
    polygonAmoy,
  ],
  ssr: true, // Enable SSR for Next.js
});

export function Web3Provider({ children }: { children: ReactNode }) {
  // Create query client inside component to avoid re-initialization
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Disable refetch on window focus during SSR
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#fc8d36',
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}