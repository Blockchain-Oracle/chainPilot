'use client';

/**
 * Token Price Display Card
 *
 * Displays current token price and 24h price change
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, DollarSign } from 'lucide-react';

interface TokenPriceCardProps {
  result: {
    success: boolean;
    data: {
      symbol: string;
      price: string | number;
      change24h: number;
      formattedPrice: string;
      priceChange: 'up' | 'down' | 'stable';
    };
  };
}

export function TokenPriceCard({ result }: TokenPriceCardProps) {
  // Extract data from result
  const { symbol, price: priceRaw, change24h, formattedPrice, priceChange } = result.data;

  // Convert price to number if it's a string
  const price = typeof priceRaw === 'string' ? parseFloat(priceRaw) : priceRaw;
  const isPositive = change24h > 0;
  const isNegative = change24h < 0;
  const isNeutral = change24h === 0;

  const getPriceChangeColor = () => {
    if (isPositive) return 'text-vet-success';
    if (isNegative) return 'text-vet-error';
    return 'text-vet-text-secondary';
  };

  const getPriceChangeBg = () => {
    if (isPositive) return 'from-vet-success/20 to-vet-success/10 border-vet-success/30';
    if (isNegative) return 'from-vet-error/20 to-vet-error/10 border-vet-error/30';
    return 'from-vet-surface/10 to-vet-surface/5 border-vet-border';
  };

  const getPriceChangeIcon = () => {
    if (isPositive) return <TrendingUp className="h-5 w-5" />;
    if (isNegative) return <TrendingDown className="h-5 w-5" />;
    return <Minus className="h-5 w-5" />;
  };

  const formatPriceChange = (change: number): string => {
    const abs = Math.abs(change);
    return `${change > 0 ? '+' : ''}${abs.toFixed(2)}%`;
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
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-vet-text-primary">Token Price</h3>
          </div>
          <Badge variant="secondary" className="text-lg font-bold bg-vet-accent/20 text-vet-accent border-vet-accent/30">
            {symbol}
          </Badge>
        </div>
        <p className="text-sm text-vet-text-secondary mt-1">Current market price</p>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 space-y-4">
        {/* Price Display */}
        <div className={`p-6 rounded-lg bg-gradient-to-br border ${getPriceChangeBg()}`}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-vet-accent" />
            <span className="text-sm text-vet-text-secondary">Current Price</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-vet-text-primary">
              ${price.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: price < 1 ? 6 : 2,
              })}
            </span>
            <span className="text-xl text-vet-text-secondary">USD</span>
          </div>
        </div>

        {/* 24h Price Change */}
        <div className="vet-tool-card">
          <div className="flex items-center justify-between">
            <span className="text-sm text-vet-text-secondary">24h Change</span>
            <div className={`flex items-center gap-2 ${getPriceChangeColor()}`}>
              {getPriceChangeIcon()}
              <span className="text-2xl font-bold">
                {formatPriceChange(change24h)}
              </span>
            </div>
          </div>

          {/* Price Movement Indicator */}
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-vet-surface/50 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isPositive
                      ? 'bg-vet-success'
                      : isNegative
                      ? 'bg-vet-error'
                      : 'bg-vet-text-secondary'
                  }`}
                  style={{
                    width: `${Math.min(Math.abs(change24h) * 10, 100)}%`,
                    marginLeft: isNegative ? 'auto' : '0',
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-vet-text-secondary">
              <span>Down</span>
              <span>No Change</span>
              <span>Up</span>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-2 pt-2 border-t border-vet-border">
          <div className="flex justify-between items-center">
            <span className="text-xs text-vet-text-secondary">Token</span>
            <span className="text-sm font-medium text-vet-text-primary">{symbol}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-vet-text-secondary">Formatted Price</span>
            <span className="text-sm font-mono text-vet-text-primary">{formattedPrice}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-vet-text-secondary">Trend</span>
            <Badge
              className={`text-xs ${
                isPositive
                  ? 'bg-vet-success/20 text-vet-success border-vet-success/30'
                  : isNegative
                  ? 'bg-vet-error/20 text-vet-error border-vet-error/30'
                  : 'bg-vet-surface/50 text-vet-text-secondary border-vet-border'
              }`}
            >
              {priceChange.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
