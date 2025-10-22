'use client';

/**
 * Gas Price Display Card
 *
 * Displays current gas prices (slow, standard, fast) for a blockchain
 */

import React from 'react';
import { motion } from 'framer-motion';
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
      bgColor: 'from-blue-500/20 to-blue-500/10',
      borderColor: 'border-blue-500/30',
      ...prices.slow,
    },
    {
      label: 'Standard',
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'from-orange-500/20 to-orange-500/10',
      borderColor: 'border-orange-500/30',
      ...prices.standard,
    },
    {
      label: 'Fast',
      icon: Zap,
      color: 'text-vet-success',
      bgColor: 'from-vet-success/20 to-vet-success/10',
      borderColor: 'border-vet-success/30',
      ...prices.fast,
    },
  ];

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
              <Flame className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-vet-text-primary">Gas Prices</h3>
          </div>
          <Badge variant="outline" className="border-vet-accent/30 text-vet-accent">
            {getChainName(chainId)}
          </Badge>
        </div>
        <p className="text-sm text-vet-text-secondary mt-1">Current network gas prices</p>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 space-y-4">
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
                  <span className="font-medium text-vet-text-primary">{option.label}</span>
                </div>

                {/* Price */}
                <div className="mb-2">
                  <div className="text-3xl font-bold text-vet-text-primary">
                    {formatGwei(option.gwei)}
                  </div>
                  <div className="text-xs text-vet-text-secondary">Gwei</div>
                </div>

                {/* Description */}
                <div className="text-xs text-vet-text-secondary mb-2">
                  {option.description}
                </div>

                {/* Estimated Cost */}
                <div className="pt-2 border-t border-vet-border/50">
                  <div className="text-xs text-vet-text-secondary">
                    Est. cost (21k gas)
                  </div>
                  <div className="text-sm font-medium text-vet-text-primary">
                    ~{estimateCost(option.gwei)} ETH
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommendation */}
        <Alert className="border-vet-accent/20 bg-vet-accent/10">
          <Info className="h-4 w-4 text-vet-accent" />
          <AlertDescription className="text-vet-text-secondary">{recommendation}</AlertDescription>
        </Alert>

        {/* Additional Context */}
        <div className="space-y-2 pt-2 border-t border-vet-border">
          <div className="flex justify-between items-center">
            <span className="text-xs text-vet-text-secondary">Network</span>
            <span className="text-sm font-medium text-vet-text-primary">{getChainName(chainId)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-vet-text-secondary">Gas Price Unit</span>
            <span className="text-sm font-mono text-vet-text-primary">Gwei (10⁻⁹ ETH)</span>
          </div>

          {/* Comparison Bar */}
          <div className="pt-2">
            <div className="text-xs text-vet-text-secondary mb-2">Price Comparison</div>
            <div className="relative h-8 bg-vet-surface/50 rounded-lg overflow-hidden flex">
              <div
                className="bg-blue-500/30 flex items-center justify-center text-xs font-medium text-vet-text-primary"
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
                className="bg-orange-500/30 flex items-center justify-center text-xs font-medium text-vet-text-primary"
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
                className="bg-vet-success/30 flex items-center justify-center text-xs font-medium text-vet-text-primary"
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
      </div>
    </motion.div>
  );
}
