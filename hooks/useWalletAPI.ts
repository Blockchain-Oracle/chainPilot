"use client";

import { useAccount } from "wagmi";

/**
 * Hook to provide wallet-related data for API calls
 * Uses wagmi for wallet connection state
 */
export function useWalletAPI() {
  const { address, isConnected } = useAccount();

  return {
    address: address || null,
    isConnected,
  };
}
