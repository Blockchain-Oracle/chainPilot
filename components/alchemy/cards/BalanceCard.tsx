'use client';

/**
 * Balance Display Card
 *
 * Displays native token balance (ETH, etc.) for a wallet address
 * Shows formatted balance and chain information
 * Uses VeChain-inspired design system with motion animations
 */

import React from 'react';
import { motion } from 'framer-motion';
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
    <motion.div
      className="vet-glass-card"
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-vet-text-primary">Native Balance</h3>
            <p className="text-sm text-vet-text-secondary mt-1">{getChainName(chainId)}</p>
          </div>
          <Badge variant="outline" className="border-vet-accent/30 text-vet-accent">
            {symbol}
          </Badge>
        </div>
      </div>

      {/* Balance Display */}
      <div className="px-6 pb-4">
        <motion.div
          className="p-6 rounded-lg bg-gradient-to-br from-vet-success/20 to-vet-accent/20 border border-vet-accent/30"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-vet-accent">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm text-vet-text-secondary">Total Balance</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-vet-text-primary">
              {formatBalance(balance)}
            </span>
            <span className="text-xl text-vet-text-secondary">{symbol}</span>
          </div>
          {isZeroBalance && (
            <motion.div
              className="mt-2 text-sm text-vet-text-secondary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              This wallet has no {symbol} balance
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Wallet Address & Network Info */}
      <div className="px-6 pb-4 space-y-2">
        <motion.div
          className="vet-tool-card flex justify-between items-center"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          <div className="flex flex-col gap-1">
            <span className="text-xs text-vet-text-secondary uppercase tracking-wide">Wallet Address</span>
            <span className="text-sm font-mono text-vet-text-primary">{shortenAddress(address)}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="vet-button-secondary h-8 w-8 p-0"
          >
            {copied ? (
              <CheckCircle2 className="h-4 w-4 text-vet-success" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </motion.div>

        <motion.div
          className="vet-tool-card flex justify-between items-center"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <span className="text-xs text-vet-text-secondary uppercase tracking-wide">Network</span>
          <span className="text-sm font-medium text-vet-text-primary">{getChainName(chainId)}</span>
        </motion.div>
      </div>

      {/* Balance Breakdown */}
      <motion.div
        className="px-6 pb-6 pt-2 border-t border-vet-accent/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.3 }}
      >
        <div className="text-xs text-vet-text-secondary space-y-1.5">
          <div className="flex justify-between">
            <span className="vet-caption">Raw Balance (wei/smallest unit)</span>
            <span className="font-mono text-vet-text-secondary">
              {parseFloat(balance) > 0 ? (parseFloat(balance) * 1e18).toExponential(2) : '0'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="vet-caption">Formatted</span>
            <span className="font-medium text-vet-text-primary">{formatted}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
