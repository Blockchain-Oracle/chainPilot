'use client';

/**
 * Transaction History Display Card
 *
 * Displays recent transaction history for a wallet address
 * Shows transaction details, status, and explorer links
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';
import { shortenAddress } from '@/lib/utils/validation';

interface Transaction {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  blockNumber: number;
  timestamp?: number;
  status?: 'success' | 'failed' | 'pending';
  method?: string;
  gasUsed?: string;
  gasPrice?: string;
  explorerUrl: string;
}

interface TransactionHistoryCardProps {
  result: {
    success: boolean;
    data: {
      address: string;
      chainId: number;
      count: number;
      transactions: Transaction[];
    };
  };
}

export function TransactionHistoryCard({ result }: TransactionHistoryCardProps) {
  // Extract data from result
  const { address, chainId, count, transactions } = result.data;
  const [expandedTx, setExpandedTx] = useState<string | null>(null);

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

  const formatTimestamp = (timestamp: number | undefined): string => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp * 1000);
    const now = Date.now();
    const diff = now - date.getTime();

    // Less than 1 minute
    if (diff < 60000) return 'Just now';

    // Less than 1 hour
    if (diff < 3600000) {
      const mins = Math.floor(diff / 60000);
      return `${mins} min${mins !== 1 ? 's' : ''} ago`;
    }

    // Less than 1 day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }

    // Less than 7 days
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }

    // Format as date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };

  const formatValue = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num) || num === 0) return '0';
    if (num < 0.0001) return num.toExponential(2);
    if (num < 1) return num.toFixed(6);
    return num.toFixed(4);
  };

  const getTransactionDirection = (tx: Transaction): 'sent' | 'received' | 'contract' => {
    if (!tx.to) return 'contract';
    if (tx.from.toLowerCase() === address.toLowerCase()) return 'sent';
    return 'received';
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (count === 0) {
    return (
      <Card className="border-primary/20 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Transaction History</CardTitle>
              <CardDescription>No transactions found</CardDescription>
            </div>
            <Badge variant="outline">{getChainName(chainId)}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No transactions found for this wallet</p>
            <p className="text-sm mt-2">{shortenAddress(address)}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Transaction History</CardTitle>
            <CardDescription>
              {count} recent transaction{count !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          <Badge variant="outline">{getChainName(chainId)}</Badge>
        </div>
      </CardHeader>

      <CardContent className="max-h-[600px] overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-vet-accent/20 scrollbar-track-transparent hover:scrollbar-thumb-vet-accent/40">
        {/* Wallet Address */}
        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
          <span className="text-sm text-muted-foreground">Wallet</span>
          <span className="text-sm font-mono">{shortenAddress(address)}</span>
        </div>

        {/* Transaction List */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {transactions.map((tx) => {
            const direction = getTransactionDirection(tx);
            const isExpanded = expandedTx === tx.hash;

            return (
              <div
                key={tx.hash}
                className="border rounded-lg overflow-hidden bg-card hover:bg-muted/30 transition-colors"
              >
                {/* Transaction Summary */}
                <button
                  onClick={() => setExpandedTx(isExpanded ? null : tx.hash)}
                  className="w-full p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {/* Direction Icon */}
                    <div
                      className={`p-2 rounded-full ${
                        direction === 'sent'
                          ? 'bg-red-500/10'
                          : direction === 'received'
                          ? 'bg-green-500/10'
                          : 'bg-blue-500/10'
                      }`}
                    >
                      {direction === 'sent' ? (
                        <ArrowUpRight className="h-4 w-4 text-red-500" />
                      ) : direction === 'received' ? (
                        <ArrowDownLeft className="h-4 w-4 text-green-500" />
                      ) : (
                        <ExternalLink className="h-4 w-4 text-blue-500" />
                      )}
                    </div>

                    {/* Transaction Info */}
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">{direction}</span>
                        {tx.method && (
                          <Badge variant="secondary" className="text-xs">
                            {tx.method}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {direction === 'sent' ? 'To: ' : 'From: '}
                        {shortenAddress(direction === 'sent' ? tx.to || 'Contract' : tx.from)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimestamp(tx.timestamp)}
                      </div>
                    </div>
                  </div>

                  {/* Value and Status */}
                  <div className="text-right flex flex-col items-end gap-1">
                    <div className="font-bold">
                      {formatValue(tx.value)} ETH
                    </div>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(tx.status)}
                      <span className="text-xs text-muted-foreground capitalize">
                        {tx.status || 'confirmed'}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 border-t bg-muted/20">
                    <div className="pt-3 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transaction Hash</span>
                        <span className="font-mono text-xs">{shortenAddress(tx.hash)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Block Number</span>
                        <span className="font-mono">{tx.blockNumber.toLocaleString()}</span>
                      </div>
                      {tx.gasUsed && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gas Used</span>
                          <span className="font-mono">{tx.gasUsed}</span>
                        </div>
                      )}
                      {tx.gasPrice && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gas Price</span>
                          <span className="font-mono">{tx.gasPrice} Gwei</span>
                        </div>
                      )}
                    </div>

                    {/* Explorer Link */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(tx.explorerUrl, '_blank');
                      }}
                    >
                      View on Explorer <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
