'use client';

/**
 * Token Metadata Display Card
 *
 * Displays ERC20 token metadata including name, symbol, decimals, logo
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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
    <Card className="border-primary/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Token Metadata</CardTitle>
            <CardDescription>ERC20 Token Information</CardDescription>
          </div>
          <Badge variant="outline">{getChainName(chainId)}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Token Logo and Name */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <TokenLogo
            src={logo}
            alt={symbol}
            size={64}
            fallback={
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Coins className="h-8 w-8 text-primary" />
              </div>
            }
          />

          <div className="flex-1">
            <div className="text-2xl font-bold text-primary">{symbol}</div>
            <div className="text-muted-foreground">{name}</div>
          </div>
        </div>

        {/* Token Details */}
        <div className="space-y-3">
          {/* Contract Address */}
          <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Contract Address</span>
              <span className="text-sm font-mono">{shortenAddress(contractAddress)}</span>
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

          {/* Symbol */}
          <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
            <span className="text-sm text-muted-foreground">Symbol</span>
            <Badge variant="secondary" className="text-base font-bold">
              {symbol}
            </Badge>
          </div>

          {/* Decimals */}
          <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
            <span className="text-sm text-muted-foreground">Decimals</span>
            <span className="text-sm font-medium">{decimals}</span>
          </div>

          {/* Total Supply */}
          {totalSupply && (
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">Total Supply</span>
              <div className="text-right">
                <div className="text-sm font-medium">{formatTotalSupply(totalSupply)}</div>
                <div className="text-xs text-muted-foreground">{symbol}</div>
              </div>
            </div>
          )}

          {/* Network */}
          <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
            <span className="text-sm text-muted-foreground">Network</span>
            <span className="text-sm font-medium">{getChainName(chainId)}</span>
          </div>
        </div>

        {/* Explorer Link */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.open(getExplorerUrl(), '_blank')}
        >
          View on Explorer <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
