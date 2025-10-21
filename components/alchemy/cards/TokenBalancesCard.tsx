'use client';

/**
 * Token Balances Display Card
 *
 * Displays all ERC20 token balances for a wallet address
 * Shows token symbols, amounts, and USD values
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coins, ExternalLink, Search, TrendingUp, Wallet } from 'lucide-react';
import { shortenAddress } from '@/lib/utils/validation';
import { Input } from '@/components/ui/input';
import { TokenLogo } from '@/components/ui/optimized-image';

interface TokenBalance {
  contractAddress: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  balanceFormatted?: string;
  logo?: string;
  price?: number;
  valueUsd?: number;
}

interface TokenBalancesCardProps {
  address: string;
  chain: string;
  chainId: number;
  native: {
    symbol: string;
    balance: string;
  };
  tokens: TokenBalance[];
  totalTokens: number;
}

export function TokenBalancesCard({
  address,
  chain,
  chainId,
  native,
  tokens,
  totalTokens,
}: TokenBalancesCardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'symbol' | 'balance' | 'value'>('value');

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

  const getExplorerUrl = (contractAddress: string) => {
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

  // Filter tokens based on search
  const filteredTokens = tokens.filter((token) =>
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.contractAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort tokens
  const sortedTokens = [...filteredTokens].sort((a, b) => {
    switch (sortBy) {
      case 'symbol':
        return a.symbol.localeCompare(b.symbol);
      case 'balance':
        return parseFloat(b.balanceFormatted || b.balance) - parseFloat(a.balanceFormatted || a.balance);
      case 'value':
        return (b.valueUsd || 0) - (a.valueUsd || 0);
      default:
        return 0;
    }
  });

  const totalValue = tokens.reduce((sum, token) => sum + (token.valueUsd || 0), 0);

  if (totalTokens === 0) {
    return (
      <Card className="border-primary/20 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Token Balances</CardTitle>
              <CardDescription>No ERC20 tokens found</CardDescription>
            </div>
            <Badge variant="outline">{getChainName(chainId)}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Coins className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>This wallet doesn't hold any ERC20 tokens on {getChainName(chainId)}</p>
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
            <CardTitle className="text-lg">Token Balances</CardTitle>
            <CardDescription>
              {totalTokens} token{totalTokens !== 1 ? 's' : ''} • {getChainName(chainId)}
            </CardDescription>
          </div>
          {totalValue > 0 && (
            <Badge variant="outline" className="text-lg px-3 py-1">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Wallet Address */}
        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
          <span className="text-sm text-muted-foreground">Wallet</span>
          <span className="text-sm font-mono">{shortenAddress(address)}</span>
        </div>

        {/* Native Balance */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Native Balance</div>
                <div className="font-medium">{native.symbol}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{native.balance}</div>
            </div>
          </div>
        </div>

        {/* Search and Sort */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tokens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'symbol' | 'balance' | 'value')}
            className="px-3 py-2 rounded-md border bg-background text-sm"
          >
            <option value="value">Value</option>
            <option value="balance">Balance</option>
            <option value="symbol">Symbol</option>
          </select>
        </div>

        {/* Token List */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {sortedTokens.map((token) => (
            <div
              key={token.contractAddress}
              className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                {/* Token Info */}
                <div className="flex items-center gap-3">
                  <TokenLogo
                    src={token.logo}
                    alt={token.symbol}
                    size={48}
                    className="border-2 border-primary/20"
                    fallback={
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/20">
                        <Coins className="h-6 w-6 text-primary" />
                      </div>
                    }
                  />

                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {token.symbol}
                      <a
                        href={getExplorerUrl(token.contractAddress)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="text-sm text-muted-foreground">{token.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {shortenAddress(token.contractAddress)}
                    </div>
                  </div>
                </div>

                {/* Balance and Value */}
                <div className="text-right">
                  <div className="font-bold text-lg">{token.balanceFormatted || token.balance} {token.symbol}</div>
                  {token.valueUsd !== undefined && token.valueUsd > 0 && (
                    <div className="text-sm text-green-600 dark:text-green-400 flex items-center justify-end gap-1">
                      <TrendingUp className="h-3 w-3" />
                      ${token.valueUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  )}
                  {token.price !== undefined && token.price > 0 && (
                    <div className="text-xs text-muted-foreground">
                      ${token.price < 0.01 ? token.price.toExponential(2) : token.price.toFixed(6)}/token
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTokens.length === 0 && searchTerm && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No tokens found matching "{searchTerm}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
