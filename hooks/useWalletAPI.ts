"use client";

import { useAccount, useChainId } from "wagmi";
import { useCallback } from "react";

/**
 * Hook to provide wallet-related data for API calls
 * Uses wagmi for wallet connection state
 */
export function useWalletAPI() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const fetchWithWalletHeaders = useCallback(async (url: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    // Add wallet headers if connected
    if (isConnected && address) {
      headers['x-wallet-address'] = address;
      headers['x-chain-id'] = chainId.toString();
    }

    return fetch(url, {
      ...options,
      headers,
    });
  }, [isConnected, address, chainId]);

  return {
    address: address || null,
    isConnected,
    chainId,
    fetchWithWalletHeaders,
    // Helper function to get wallet headers
    getWalletHeaders: () => {
      const headers: Record<string, string> = {};
      if (isConnected && address) {
        headers['x-wallet-address'] = address;
        headers['x-chain-id'] = chainId.toString();
      }
      return headers;
    },
  };
}
