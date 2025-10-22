'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { toast } from 'sonner';
import type { IInit, SwapResult, QuoteResponse, TransactionError } from '@/types/plugin';

export interface JupiterSwapWidgetProps {
  /**
   * Display mode: 'widget' for floating button, 'modal' for on-demand popup,
   * 'integrated' for embedded in page
   */
  displayMode?: 'widget' | 'modal' | 'integrated';

  /**
   * For integrated mode: target element ID
   */
  integratedTargetId?: string;

  /**
   * For widget mode: position and size
   */
  widgetStyle?: {
    position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
    size?: 'sm' | 'default';
  };

  /**
   * Pre-fill swap parameters (for AI-triggered swaps)
   */
  initialSwap?: {
    inputMint?: string;
    outputMint?: string;
    amount?: string;
    fixedMint?: string;
    fixedAmount?: boolean;
  };

  /**
   * Callbacks
   */
  onSuccess?: (txid: string, swapResult: SwapResult) => void;
  onError?: (error: string) => void;
}

/**
 * Jupiter Swap Widget Component
 *
 * Integrates Jupiter Plugin with wallet passthrough from wagmi
 * Supports AI-triggered swaps with pre-filled parameters
 */
export function JupiterSwapWidget({
  displayMode = 'widget',
  integratedTargetId = 'jupiter-swap',
  widgetStyle = {
    position: 'bottom-right',
    size: 'default',
  },
  initialSwap,
  onSuccess,
  onError,
}: JupiterSwapWidgetProps) {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const initializedRef = useRef(false);

  // Handle swap success
  const handleSuccess = useCallback(
    ({
      txid,
      swapResult,
      quoteResponseMeta,
    }: {
      txid: string;
      swapResult: SwapResult;
      quoteResponseMeta: QuoteResponse | null;
    }) => {
      console.log('[JupiterSwap] Swap successful:', {
        txid,
        swapResult,
        priceImpact: quoteResponseMeta?.priceImpactPct,
      });

      // Show success toast
      toast.success('Swap successful!', {
        description: `Transaction: ${txid.slice(0, 8)}...${txid.slice(-8)}`,
        action: {
          label: 'View',
          onClick: () => window.open(`https://solscan.io/tx/${txid}`, '_blank'),
        },
      });

      // Call parent callback
      onSuccess?.(txid, swapResult);
    },
    [onSuccess]
  );

  // Handle swap error
  const handleError = useCallback(
    ({
      error,
      quoteResponseMeta,
    }: {
      error?: TransactionError;
      quoteResponseMeta: QuoteResponse | null;
    }) => {
      console.error('[JupiterSwap] Swap failed:', error);

      const errorMessage = error?.message || 'Swap failed';

      // Show error toast
      toast.error('Swap failed', {
        description: errorMessage,
      });

      // Call parent callback
      onError?.(errorMessage);
    },
    [onError]
  );

  // Initialize Jupiter Plugin
  useEffect(() => {
    // Only initialize once
    if (initializedRef.current) return;

    // Wait for Jupiter to be available
    if (typeof window === 'undefined' || !window.Jupiter) {
      console.log('[JupiterSwap] Waiting for Jupiter Plugin to load...');
      return;
    }

    console.log('[JupiterSwap] Initializing Jupiter Plugin', {
      displayMode,
      isConnected,
      hasWallet: !!walletClient,
    });

    // Initialize config
    const config: IInit = {
      displayMode,
      localStoragePrefix: 'chainpilot-jupiter',
      defaultExplorer: 'Solscan',

      // Wallet passthrough - use wagmi wallet
      enableWalletPassthrough: true,
      passthroughWalletContextState: walletClient as any,

      // Display configuration
      ...(displayMode === 'integrated' && { integratedTargetId }),
      ...(displayMode === 'widget' && { widgetStyle }),

      // Pre-fill form if initialSwap provided
      ...(initialSwap && {
        formProps: {
          initialInputMint: initialSwap.inputMint,
          initialOutputMint: initialSwap.outputMint,
          initialAmount: initialSwap.amount,
          fixedMint: initialSwap.fixedMint,
          fixedAmount: initialSwap.fixedAmount,
        },
      }),

      // Event handlers
      onSuccess: handleSuccess,
      onSwapError: handleError,

      // Branding
      branding: {
        name: 'ChainPilot',
      },
    };

    // Initialize plugin
    try {
      window.Jupiter.init(config);
      initializedRef.current = true;
      console.log('[JupiterSwap] Plugin initialized successfully');
    } catch (error) {
      console.error('[JupiterSwap] Failed to initialize plugin:', error);
      toast.error('Failed to initialize swap widget');
    }
  }, [
    displayMode,
    integratedTargetId,
    widgetStyle,
    initialSwap,
    walletClient,
    isConnected,
    handleSuccess,
    handleError,
  ]);

  // Sync wallet state when it changes
  useEffect(() => {
    if (!initializedRef.current || !window.Jupiter) return;

    console.log('[JupiterSwap] Syncing wallet state', { isConnected, address });

    window.Jupiter.syncProps({
      passthroughWalletContextState: walletClient as any,
    });
  }, [walletClient, isConnected, address]);

  // For integrated mode, render target div
  if (displayMode === 'integrated') {
    return (
      <div className="w-full">
        <div
          id={integratedTargetId}
          className="w-full min-h-[600px] rounded-lg overflow-hidden"
        />
      </div>
    );
  }

  // For widget/modal mode, nothing to render (plugin handles UI)
  return null;
}

/**
 * Hook to trigger Jupiter swap programmatically
 */
export function useJupiterSwap() {
  const openSwap = useCallback(
    (params?: {
      inputMint?: string;
      outputMint?: string;
      amount?: string;
    }) => {
      if (typeof window === 'undefined' || !window.Jupiter) {
        toast.error('Swap widget not available');
        return;
      }

      // Update form props if provided
      if (params) {
        // Re-initialize with new params
        window.Jupiter.init({
          displayMode: 'modal',
          formProps: {
            initialInputMint: params.inputMint,
            initialOutputMint: params.outputMint,
            initialAmount: params.amount,
          },
        });
      }

      // Open the plugin
      window.Jupiter.resume();
    },
    []
  );

  const closeSwap = useCallback(() => {
    if (typeof window === 'undefined' || !window.Jupiter) return;
    window.Jupiter.close();
  }, []);

  return { openSwap, closeSwap };
}
