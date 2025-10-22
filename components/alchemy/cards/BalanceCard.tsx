'use client';

/**
 * Balance Display Card
 *
 * Displays native token balance (ETH, etc.) for a wallet address
 * Shows formatted balance and chain information
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Copy, CheckCircle2 } from 'lucide-react';
import { shortenAddress } from '@/lib/utils/validation';
import { Button } from '@/components/ui/button';

interface BalanceCardProps {
  result: {
    success: boolean;
    data: {
      address: string;
      balance: string;
      symbol: string;
      chain: string;
      chainId: number;
      formatted: string;
    };
  };
}

export function BalanceCard({ result }: BalanceCardProps) {
  // Extract data from result
  const { address, balance, symbol, chain, chainId, formatted } = result.data;
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    return names[chainId] || chain;
  };

  const formatBalance = (balance: string, decimals: number = 4): string => {
    const num = parseFloat(balance);
    if (isNaN(num)) return balance;

    // For very small numbers, show more decimals
    if (num < 0.0001 && num > 0) {
      return num.toFixed(8);
    }

    // For large numbers, use comma separators
    if (num >= 1000) {
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: decimals
      });
    }

    return num.toFixed(decimals);
  };

  const balanceValue = parseFloat(balance);
  const isZeroBalance = balanceValue === 0;

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Native Balance</CardTitle>
            <CardDescription>{getChainName(chainId)}</CardDescription>
          </div>
          <Badge variant="outline">{symbol}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Balance Display */}
        <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Total Balance</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">
              {formatBalance(balance)}
            </span>
            <span className="text-xl text-muted-foreground">{symbol}</span>
          </div>
          {isZeroBalance && (
            <div className="mt-2 text-sm text-muted-foreground">
              This wallet has no {symbol} balance
            </div>
          )}
        </div>

        {/* Wallet Address */}
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Wallet Address</span>
              <span className="text-sm font-mono">{shortenAddress(address)}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0"
            >
              {copied ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
            <span className="text-xs text-muted-foreground">Network</span>
            <span className="text-sm font-medium">{getChainName(chainId)}</span>
          </div>
        </div>

        {/* Balance Breakdown (for additional context) */}
        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Raw Balance (wei/smallest unit)</span>
              <span className="font-mono">
                {parseFloat(balance) > 0 ? (parseFloat(balance) * 1e18).toExponential(2) : '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Formatted</span>
              <span className="font-medium">{formatted}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
