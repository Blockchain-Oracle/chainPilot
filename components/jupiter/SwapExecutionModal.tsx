'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { IInit } from '@/types/plugin';

interface SwapExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputMint: string;
  outputMint: string;
  amount: string;
  onSuccess?: (txid: string) => void;
  onError?: (error: string) => void;
}

/**
 * SwapExecutionModal
 *
 * Modal that opens when user clicks "Execute Swap" on SwapQuoteCard
 * Shows Jupiter Plugin in modal mode with pre-filled parameters
 */
export function SwapExecutionModal({
  isOpen,
  onClose,
  inputMint,
  outputMint,
  amount,
  onSuccess,
  onError,
}: SwapExecutionModalProps) {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [isInitialized, setIsInitialized] = useState(false);

  // Handle swap success
  const handleSuccess = useCallback(
    ({ txid }: { txid: string }) => {
      console.log('[SwapExecutionModal] Swap successful:', txid);

      // Show success toast
      toast.success('Swap successful!', {
        description: `Transaction: ${txid.slice(0, 8)}...${txid.slice(-8)}`,
        action: {
          label: 'View',
          onClick: () => window.open(`https://solscan.io/tx/${txid}`, '_blank'),
        },
      });

      // Call parent callback
      onSuccess?.(txid);

      // Close modal after short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    },
    [onSuccess, onClose]
  );

  // Handle swap error
  const handleError = useCallback(
    ({ error }: { error?: { message?: string } }) => {
      console.error('[SwapExecutionModal] Swap failed:', error);

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

  // Initialize Jupiter Plugin when modal opens
  useEffect(() => {
    if (!isOpen) {
      setIsInitialized(false);
      return;
    }

    // Wait for Jupiter to be available
    if (typeof window === 'undefined' || !window.Jupiter) {
      console.log('[SwapExecutionModal] Waiting for Jupiter Plugin to load...');
      return;
    }

    console.log('[SwapExecutionModal] Initializing Jupiter Plugin', {
      inputMint,
      outputMint,
      amount,
      isConnected,
      hasWallet: !!walletClient,
    });

    // Initialize config
    const config: IInit = {
      displayMode: 'modal',
      localStoragePrefix: 'chainpilot-jupiter-modal',
      defaultExplorer: 'Solscan',

      // Wallet passthrough
      enableWalletPassthrough: true,
      passthroughWalletContextState: walletClient as any,

      // Pre-fill with quote data
      formProps: {
        initialInputMint: inputMint,
        initialOutputMint: outputMint,
        initialAmount: amount,
        // Optional: lock the token pair so user can only adjust amount
        // fixedMint: inputMint,
      },

      // Event handlers
      onSuccess: handleSuccess as any,
      onSwapError: handleError as any,

      // Branding
      branding: {
        name: 'ChainPilot',
      },
    };

    // Initialize plugin
    try {
      window.Jupiter.init(config);
      window.Jupiter.resume(); // Open the modal
      setIsInitialized(true);
      console.log('[SwapExecutionModal] Plugin initialized and opened');
    } catch (error) {
      console.error('[SwapExecutionModal] Failed to initialize plugin:', error);
      toast.error('Failed to open swap interface');
      onClose();
    }
  }, [
    isOpen,
    inputMint,
    outputMint,
    amount,
    walletClient,
    isConnected,
    handleSuccess,
    handleError,
    onClose,
  ]);

  // Close Jupiter modal when component closes
  useEffect(() => {
    if (!isOpen && isInitialized && window.Jupiter) {
      window.Jupiter.close();
    }
  }, [isOpen, isInitialized]);

  // Sync wallet state when it changes
  useEffect(() => {
    if (!isInitialized || !window.Jupiter) return;

    window.Jupiter.syncProps({
      passthroughWalletContextState: walletClient as any,
    });
  }, [walletClient, isInitialized]);

  if (!isOpen) return null;

  // Custom overlay to match VeChain design
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="relative">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-12 right-0 text-white hover:text-vet-accent"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </Button>

        {/* Jupiter modal will render here */}
        <div className="text-white text-center">
          <p className="text-sm text-vet-text-secondary mb-4">
            Jupiter Swap Interface
          </p>
        </div>
      </div>
    </div>
  );
}
