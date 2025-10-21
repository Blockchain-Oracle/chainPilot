'use client';

/**
 * Contract Call Card Component
 *
 * UI card for generic smart contract interactions
 * Uses wagmi useWriteContract hook with pre-encoded data
 */

import React, { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import type { ContractCallProps } from '@/lib/types/transactions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { shortenAddress, formatEth } from '@/lib/utils/validation';
import { Loader2, CheckCircle2, XCircle, ExternalLink, AlertTriangle, Code2 } from 'lucide-react';

interface ContractCallCardProps extends ContractCallProps {}

export function ContractCallCard({
  from,
  contractAddress,
  contractName,
  functionName,
  data,
  value,
  chainId,
  gasEstimate,
  gasPrice,
  comment,
}: ContractCallCardProps) {
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

  const handleExecute = () => {
    setError(null);
    try {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: [], // Using raw data, no ABI needed
        data: data as `0x${string}`,
        value: value ? BigInt(value) : undefined,
        chainId,
      } as any);
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

  const formatValue = (valueWei: string | undefined): string => {
    if (!valueWei || valueWei === '0') return '0';
    try {
      return formatEth(BigInt(valueWei), 6);
    } catch {
      return '0';
    }
  };

  const isPayable = value && value !== '0';

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Contract Interaction
            </CardTitle>
            <CardDescription>Execute smart contract function</CardDescription>
          </div>
          <Badge variant="outline">{getChainName(chainId)}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contract Details */}
        <div className="space-y-3 p-4 rounded-lg bg-muted/50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Contract</span>
            <div className="text-right">
              {contractName && (
                <div className="font-medium text-primary">{contractName}</div>
              )}
              <div className="text-xs font-mono">{shortenAddress(contractAddress)}</div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Function</span>
            <Badge variant="secondary" className="font-mono">
              {functionName}()
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">From</span>
            <span className="text-sm font-mono">{shortenAddress(from)}</span>
          </div>

          {isPayable && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">ETH Value</span>
              <span className="text-lg font-bold text-primary">
                {formatValue(value)} ETH
              </span>
            </div>
          )}

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

        {/* Function Data */}
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="text-xs text-muted-foreground mb-2">Encoded Function Data</div>
          <div className="font-mono text-xs break-all bg-muted/50 p-2 rounded border">
            {data}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Function Selector: <span className="font-mono">{data.slice(0, 10)}</span>
          </div>
        </div>

        {/* Comment/Context */}
        {comment && (
          <Alert className="border-blue-500/50 bg-blue-500/10">
            <AlertDescription>
              <div className="text-xs">{comment}</div>
            </AlertDescription>
          </Alert>
        )}

        {/* Payable Function Warning */}
        {isPayable && !isConfirmed && (
          <Alert className="border-orange-500/50 bg-orange-500/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-1">Payable Function</div>
              <div className="text-xs">
                This transaction will send {formatValue(value)} ETH to the contract.
                Make sure this is intentional.
              </div>
            </AlertDescription>
          </Alert>
        )}

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
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleExecute}
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
              Executed Successfully
            </>
          ) : (
            <>Execute {functionName}()</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
