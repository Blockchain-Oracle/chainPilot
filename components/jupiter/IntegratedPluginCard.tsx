'use client';

import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { useAccount, useWalletClient } from 'wagmi';
import type { IInit } from '@/types/plugin';

interface IntegratedPluginCardProps {
  result: {
    success: boolean;
    data?: {
      mode: 'integrated';
      formProps?: {
        initialInputMint?: string;
        initialOutputMint?: string;
        initialAmount?: string;
      };
    };
  };
}

/**
 * IntegratedPluginCard
 *
 * Shows the full Jupiter swap interface inline in the chat
 * Used when user requests the plugin via jupiter_show_plugin tool
 */
export function IntegratedPluginCard({ result }: IntegratedPluginCardProps) {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const initializedRef = useRef(false);
  const containerIdRef = useRef(`jupiter-integrated-${Math.random().toString(36).substring(7)}`);

  useEffect(() => {
    // Only initialize once
    if (initializedRef.current) return;

    // Wait for Jupiter to be available
    if (typeof window === 'undefined' || !window.Jupiter) {
      console.log('[IntegratedPluginCard] Waiting for Jupiter Plugin to load...');
      return;
    }

    if (!result.success || !result.data) {
      console.error('[IntegratedPluginCard] Invalid result data');
      return;
    }

    console.log('[IntegratedPluginCard] Initializing Jupiter Plugin', {
      containerId: containerIdRef.current,
      isConnected,
      hasWallet: !!walletClient,
      formProps: result.data.formProps,
    });

    // Initialize config
    const config: IInit = {
      displayMode: 'integrated',
      integratedTargetId: containerIdRef.current,
      localStoragePrefix: 'chainpilot-jupiter',
      defaultExplorer: 'Solscan',

      // Wallet passthrough
      enableWalletPassthrough: true,
      passthroughWalletContextState: walletClient as any,

      // Container styling to match VeChain design
      containerStyles: {
        width: '100%',
        maxWidth: '100%',
        minHeight: '600px',
        borderRadius: '12px',
        overflow: 'hidden',
      },
      containerClassName: 'vet-jupiter-container',

      // Pre-fill form if provided
      ...(result.data.formProps && {
        formProps: {
          initialInputMint: result.data.formProps.initialInputMint,
          initialOutputMint: result.data.formProps.initialOutputMint,
          initialAmount: result.data.formProps.initialAmount,
        },
      }),

      // Branding
      branding: {
        name: 'ChainPilot',
      },
    };

    // Initialize plugin
    try {
      window.Jupiter.init(config);
      initializedRef.current = true;
      console.log('[IntegratedPluginCard] Plugin initialized successfully');
    } catch (error) {
      console.error('[IntegratedPluginCard] Failed to initialize plugin:', error);
    }
  }, [result, walletClient, isConnected]);

  // Sync wallet state when it changes
  useEffect(() => {
    if (!initializedRef.current || !window.Jupiter) return;

    console.log('[IntegratedPluginCard] Syncing wallet state', { isConnected, address });

    window.Jupiter.syncProps({
      passthroughWalletContextState: walletClient as any,
    });
  }, [walletClient, isConnected, address]);

  if (!result.success || !result.data) {
    return (
      <Card className="vet-glass-card">
        <CardContent className="pt-6">
          <p className="text-red-500">Failed to load Jupiter plugin</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="vet-glass-card border-vet-accent/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-vet-accent/10 flex items-center justify-center">
              <Sparkles className="size-5 text-vet-accent" />
            </div>
            <div>
              <CardTitle>Jupiter Swap</CardTitle>
              <p className="text-sm text-muted-foreground">
                Swap any Solana tokens with best prices
              </p>
            </div>
          </div>
          <Badge className="bg-green-500 hover:bg-green-600">Live</Badge>
        </div>
      </CardHeader>

      <CardContent>
        {/* Jupiter Plugin will render here */}
        <div
          id={containerIdRef.current}
          className="w-full min-h-[600px] rounded-lg overflow-hidden"
          style={{
            background: 'transparent',
          }}
        />

        {/* Info footer */}
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-400">
            💡 <strong>Tip:</strong> Jupiter aggregates the best prices across all Solana DEXs.
            Your swap is secured by your connected wallet.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
