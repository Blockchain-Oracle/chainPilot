'use client';

/**
 * Token Metadata Display Card
 *
 * Displays ERC20 token metadata including name, symbol, decimals, logo
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coins, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';
import { shortenAddress } from '@/lib/utils/validation';
import { TokenLogo } from '@/components/ui/optimized-image';

interface TokenMetadataCardProps {
  result: {
    success: boolean;
    data: {
      contractAddress: string;
      chainId: number;
      name: string;
      symbol: string;
      decimals: number;
      logo?: string;
      totalSupply?: string;
    };
  };
}

export function TokenMetadataCard({ result }: TokenMetadataCardProps) {
  // Extract data from result
  const { contractAddress, chainId, name, symbol, decimals, logo, totalSupply } = result.data;
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(contractAddress);
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
    return names[chainId] || `Chain ${chainId}`;
  };

  const getExplorerUrl = () => {
    const explorers: Record<number, string> = {
      1: 'https://etherscan.io/token/',
      11155111: 'https://sepolia.etherscan.io/token/',
      8453: 'https://basescan.org/token/',
      84532: 'https://sepolia.basescan.org/token/',
      42161: 'https://arbiscan.io/token/',
      421614: 'https://sepolia.arbiscan.io/token/',
      10: 'https://optimistic.etherscan.io/token/',
      11155420: 'https://sepolia-optimism.etherscan.io/token/',
      137: 'https://polygonscan.com/token/',
      80002: 'https://amoy.polygonscan.com/token/',
    };
    return `${explorers[chainId] || explorers[1]}${contractAddress}`;
  };

  const formatTotalSupply = (supply: string | undefined): string => {
    if (!supply) return 'Unknown';
    const num = parseFloat(supply);
    if (isNaN(num)) return supply;
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="vet-glass-card"
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-vet-accent">
              <Coins className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-vet-text-primary">Token Metadata</h3>
          </div>
          <Badge variant="outline" className="border-vet-accent/30 text-vet-accent">
            {getChainName(chainId)}
          </Badge>
        </div>
        <p className="text-sm text-vet-text-secondary mt-1">ERC20 Token Information</p>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 space-y-4">
        {/* Token Logo and Name */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-br from-vet-accent/20 to-vet-success/20 border border-vet-accent/30">
          <TokenLogo
            src={logo}
            alt={symbol}
            size={64}
            fallback={
              <div className="w-16 h-16 rounded-full bg-vet-accent/20 flex items-center justify-center">
                <Coins className="h-8 w-8 text-vet-accent" />
              </div>
            }
          />

          <div className="flex-1">
            <div className="text-2xl font-bold text-vet-text-primary">{symbol}</div>
            <div className="text-vet-text-secondary">{name}</div>
          </div>
        </div>

        {/* Token Details */}
        <div className="space-y-3">
          {/* Contract Address */}
          <div className="vet-tool-card flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-vet-text-secondary uppercase tracking-wide">Contract Address</span>
              <span className="text-sm font-mono text-vet-text-primary">{shortenAddress(contractAddress)}</span>
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
          </div>

          {/* Symbol */}
          <div className="vet-tool-card flex justify-between items-center">
            <span className="text-sm text-vet-text-secondary">Symbol</span>
            <Badge variant="secondary" className="text-base font-bold bg-vet-accent/20 text-vet-accent border-vet-accent/30">
              {symbol}
            </Badge>
          </div>

          {/* Decimals */}
          <div className="vet-tool-card flex justify-between items-center">
            <span className="text-sm text-vet-text-secondary">Decimals</span>
            <span className="text-sm font-medium text-vet-text-primary">{decimals}</span>
          </div>

          {/* Total Supply */}
          {totalSupply && (
            <div className="vet-tool-card flex justify-between items-center">
              <span className="text-sm text-vet-text-secondary">Total Supply</span>
              <div className="text-right">
                <div className="text-sm font-medium text-vet-text-primary">{formatTotalSupply(totalSupply)}</div>
                <div className="text-xs text-vet-text-secondary">{symbol}</div>
              </div>
            </div>
          )}

          {/* Network */}
          <div className="vet-tool-card flex justify-between items-center">
            <span className="text-sm text-vet-text-secondary">Network</span>
            <span className="text-sm font-medium text-vet-text-primary">{getChainName(chainId)}</span>
          </div>
        </div>

        {/* Explorer Link */}
        <Button
          className="vet-button-secondary w-full"
          onClick={() => window.open(getExplorerUrl(), '_blank')}
        >
          View on Explorer <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
