'use client';

/**
 * Token Transfer Card Component
 *
 * UI card for ERC20 token transfer transactions
 * Uses wagmi useWriteContract hook for execution
 */

import React, { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import type { TokenTransferProps } from '@/lib/types/transactions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { shortenAddress, formatEth } from '@/lib/utils/validation';
import { Loader2, CheckCircle2, XCircle, ExternalLink, AlertTriangle, Coins } from 'lucide-react';

interface TokenTransferCardProps extends TokenTransferProps {}

export function TokenTransferCard({
  from,
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  to,
  amount,
  amountWei,
  data,
  chainId,
  gasEstimate,
  gasPrice,
  toEnsName,
}: TokenTransferCardProps) {
  const [error, setError] = useState<string | null>(null);

  // Wagmi hook for writing contract
  const {
    writeContract,
    data: hash,
    isPending: isSending,
    isError: isSendError,
    error: sendError,
  } = useWriteContract();

  // Wait for transaction confirmation
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSend = () => {
    setError(null);
    try {
      writeContract({
        address: tokenAddress as `0x${string}`,
        abi: [
          {
            name: 'transfer',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'to', type: 'address' },
              { name: 'amount', type: 'uint256' },
            ],
            outputs: [{ name: '', type: 'bool' }],
          },
        ],
        functionName: 'transfer',
        args: [to as `0x${string}`, BigInt(amountWei)],
        chainId,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send transaction');
    }
  };

  const getExplorerUrl = (hash: string) => {
    const explorers: Record<number, string> = {
      1: 'https://etherscan.io/tx/',
      11155111: 'https://sepolia.etherscan.io/tx/',
      8453: 'https://basescan.org/tx/',
      84532: 'https://sepolia.basescan.org/tx/',
      42161: 'https://arbiscan.io/tx/',
      421614: 'https://sepolia.arbiscan.io/tx/',
      10: 'https://optimistic.etherscan.io/tx/',
      11155420: 'https://sepolia-optimism.etherscan.io/tx/',
      137: 'https://polygonscan.com/tx/',
      80002: 'https://amoy.polygonscan.com/tx/',
    };
    return `${explorers[chainId] || explorers[1]}${hash}`;
  };

  const getChainName = (chainId: number): string => {
    const names: Record<number, string> = {
      1: 'Ethereum',
      11155111: 'Sepolia',
      8453: 'Base',
      84532: 'Base Sepolia',
      42161: 'Arbitrum',
      421614: 'Arbitrum Sepolia',
      10: 'Optimism',
      11155420: 'Optimism Sepolia',
      137: 'Polygon',
      80002: 'Polygon Amoy',
    };
    return names[chainId] || `Chain ${chainId}`;
  };

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Token Transfer
            </CardTitle>
            <CardDescription>Send ERC20 tokens to another address</CardDescription>
          </div>
          <Badge variant="outline">{getChainName(chainId)}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Transfer Details */}
        <div className="space-y-3 p-4 rounded-lg bg-muted/50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Token</span>
            <div className="text-right">
              <div className="font-medium">{tokenSymbol}</div>
              <div className="text-xs text-muted-foreground">{shortenAddress(tokenAddress)}</div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Amount</span>
            <span className="text-lg font-bold text-primary">{amount} {tokenSymbol}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">From</span>
            <span className="text-sm font-mono">{shortenAddress(from)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">To</span>
            <div className="text-right">
              {toEnsName && (
                <div className="text-sm font-medium text-primary">{toEnsName}</div>
              )}
              <span className="text-sm font-mono">{shortenAddress(to)}</span>
            </div>
          </div>

          {gasEstimate && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Estimated Gas</span>
              <span className="text-sm">
                {gasEstimate} units
                {gasPrice && (
                  <span className="text-muted-foreground">
                    {' '}(~{formatEth(BigInt(gasPrice) * BigInt(gasEstimate), 6)} ETH)
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Status Messages */}
        {isSending && (
          <Alert className="border-blue-500/50 bg-blue-500/10">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Waiting for wallet confirmation...
            </AlertDescription>
          </Alert>
        )}

        {isConfirming && (
          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Transaction submitted. Waiting for confirmation...
            </AlertDescription>
          </Alert>
        )}

        {isConfirmed && hash && (
          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Transaction confirmed!</span>
              <a
                href={getExplorerUrl(hash)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                View on Explorer <ExternalLink className="h-3 w-3" />
              </a>
            </AlertDescription>
          </Alert>
        )}

        {(error || isSendError) && (
          <Alert className="border-red-500/50 bg-red-500/10">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              {error || sendError?.message || 'Transaction failed'}
            </AlertDescription>
          </Alert>
        )}

        {/* Warning for high value transactions */}
        {parseFloat(amount) > 1000 && !isConfirmed && (
          <Alert className="border-orange-500/50 bg-orange-500/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Large transfer detected. Please verify the recipient address and amount carefully.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleSend}
          disabled={isSending || isConfirming || isConfirmed}
          className="w-full"
          size="lg"
        >
          {isSending || isConfirming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isSending ? 'Approve in Wallet...' : 'Confirming...'}
            </>
          ) : isConfirmed ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Sent Successfully
            </>
          ) : (
            `Send ${amount} ${tokenSymbol}`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
