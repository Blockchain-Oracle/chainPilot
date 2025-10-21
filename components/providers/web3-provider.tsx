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
  // Create a new QueryClient instance for each request to avoid sharing state
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Prevent refetching on window focus in the terminal UI
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: 'hsl(26, 78%, 61%)',
            accentColorForeground: 'hsl(220, 13%, 8%)',
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