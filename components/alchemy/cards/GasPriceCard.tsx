'use client';

/**
 * Gas Price Display Card
 *
 * Displays current gas prices (slow, standard, fast) for a blockchain
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Clock, Zap, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface GasPriceOption {
  gwei: string;
  description: string;
}

interface GasPriceCardProps {
  result: {
    success: boolean;
    data: {
      chainId: number;
      chain: string;
      prices: {
        slow: GasPriceOption;
        standard: GasPriceOption;
        fast: GasPriceOption;
      };
      recommendation: string;
    };
  };
}

export function GasPriceCard({ result }: GasPriceCardProps) {
  // Extract data from result
  const { chainId, chain, prices, recommendation } = result.data;
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

  const formatGwei = (gwei: string): string => {
    const num = parseFloat(gwei);
    if (isNaN(num)) return gwei;
    return num.toFixed(2);
  };

  const estimateCost = (gwei: string, gasLimit: number = 21000): string => {
    const gweiNum = parseFloat(gwei);
    if (isNaN(gweiNum)) return '0.00';
    const ethCost = (gweiNum * gasLimit) / 1e9;
    return ethCost.toFixed(6);
  };

  const gasPrices = [
    {
      label: 'Slow',
      icon: Clock,
      color: 'text-blue-500',
      bgColor: 'from-blue-500/10 to-blue-500/5',
      borderColor: 'border-blue-500/20',
      ...prices.slow,
    },
    {
      label: 'Standard',
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'from-orange-500/10 to-orange-500/5',
      borderColor: 'border-orange-500/20',
      ...prices.standard,
    },
    {
      label: 'Fast',
      icon: Zap,
      color: 'text-green-500',
      bgColor: 'from-green-500/10 to-green-500/5',
      borderColor: 'border-green-500/20',
      ...prices.fast,
    },
  ];

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Gas Prices</CardTitle>
            <CardDescription>Current network gas prices</CardDescription>
          </div>
          <Badge variant="outline">{getChainName(chainId)}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Gas Price Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {gasPrices.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.label}
                className={`p-4 rounded-lg bg-gradient-to-br border ${option.bgColor} ${option.borderColor}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-5 w-5 ${option.color}`} />
                  <span className="font-medium">{option.label}</span>
                </div>

                {/* Price */}
                <div className="mb-2">
                  <div className="text-3xl font-bold text-primary">
                    {formatGwei(option.gwei)}
                  </div>
                  <div className="text-xs text-muted-foreground">Gwei</div>
                </div>

                {/* Description */}
                <div className="text-xs text-muted-foreground mb-2">
                  {option.description}
                </div>

                {/* Estimated Cost */}
                <div className="pt-2 border-t border-muted/20">
                  <div className="text-xs text-muted-foreground">
                    Est. cost (21k gas)
                  </div>
                  <div className="text-sm font-medium">
                    ~{estimateCost(option.gwei)} ETH
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommendation */}
        <Alert className="border-primary/20 bg-primary/5">
          <Info className="h-4 w-4" />
          <AlertDescription>{recommendation}</AlertDescription>
        </Alert>

        {/* Additional Context */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Network</span>
            <span className="text-sm font-medium">{getChainName(chainId)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Gas Price Unit</span>
            <span className="text-sm font-mono">Gwei (10⁻⁹ ETH)</span>
          </div>

          {/* Comparison Bar */}
          <div className="pt-2">
            <div className="text-xs text-muted-foreground mb-2">Price Comparison</div>
            <div className="relative h-8 bg-muted rounded-lg overflow-hidden flex">
              <div
                className="bg-blue-500/30 flex items-center justify-center text-xs font-medium"
                style={{
                  width: `${
                    (parseFloat(prices.slow.gwei) /
                      (parseFloat(prices.slow.gwei) +
                        parseFloat(prices.standard.gwei) +
                        parseFloat(prices.fast.gwei))) *
                    100
                  }%`,
                }}
              >
                Slow
              </div>
              <div
                className="bg-orange-500/30 flex items-center justify-center text-xs font-medium"
                style={{
                  width: `${
                    (parseFloat(prices.standard.gwei) /
                      (parseFloat(prices.slow.gwei) +
                        parseFloat(prices.standard.gwei) +
                        parseFloat(prices.fast.gwei))) *
                    100
                  }%`,
                }}
              >
                Standard
              </div>
              <div
                className="bg-green-500/30 flex items-center justify-center text-xs font-medium"
                style={{
                  width: `${
                    (parseFloat(prices.fast.gwei) /
                      (parseFloat(prices.slow.gwei) +
                        parseFloat(prices.standard.gwei) +
                        parseFloat(prices.fast.gwei))) *
                    100
                  }%`,
                }}
              >
                Fast
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
