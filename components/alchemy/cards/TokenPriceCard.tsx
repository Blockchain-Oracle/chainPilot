'use client';

/**
 * Token Price Display Card
 *
 * Displays current token price and 24h price change
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, DollarSign } from 'lucide-react';

interface TokenPriceCardProps {
  symbol: string;
  price: number;
  change24h: number;
  formattedPrice: string;
  priceChange: 'up' | 'down' | 'stable';
}

export function TokenPriceCard({
  symbol,
  price,
  change24h,
  formattedPrice,
  priceChange,
}: TokenPriceCardProps) {
  const isPositive = change24h > 0;
  const isNegative = change24h < 0;
  const isNeutral = change24h === 0;

  const getPriceChangeColor = () => {
    if (isPositive) return 'text-green-500';
    if (isNegative) return 'text-red-500';
    return 'text-muted-foreground';
  };

  const getPriceChangeBg = () => {
    if (isPositive) return 'from-green-500/10 to-green-500/5 border-green-500/20';
    if (isNegative) return 'from-red-500/10 to-red-500/5 border-red-500/20';
    return 'from-muted/10 to-muted/5 border-muted/20';
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
    <Card className="border-primary/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Token Price</CardTitle>
            <CardDescription>Current market price</CardDescription>
          </div>
          <Badge variant="secondary" className="text-lg font-bold">
            {symbol}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price Display */}
        <div className={`p-6 rounded-lg bg-gradient-to-br border ${getPriceChangeBg()}`}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Current Price</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">
              ${price.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: price < 1 ? 6 : 2,
              })}
            </span>
            <span className="text-xl text-muted-foreground">USD</span>
          </div>
        </div>

        {/* 24h Price Change */}
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">24h Change</span>
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
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isPositive
                      ? 'bg-green-500'
                      : isNegative
                      ? 'bg-red-500'
                      : 'bg-muted-foreground'
                  }`}
                  style={{
                    width: `${Math.min(Math.abs(change24h) * 10, 100)}%`,
                    marginLeft: isNegative ? 'auto' : '0',
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>Down</span>
              <span>No Change</span>
              <span>Up</span>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Token</span>
            <span className="text-sm font-medium">{symbol}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Formatted Price</span>
            <span className="text-sm font-mono">{formattedPrice}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Trend</span>
            <Badge
              variant={isPositive ? 'default' : isNegative ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              {priceChange.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
