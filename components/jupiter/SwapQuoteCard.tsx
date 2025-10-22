'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, AlertCircle, Zap, TrendingUp, Rocket } from 'lucide-react';
import { SwapExecutionModal } from './SwapExecutionModal';
import type { OrderResponse } from '@/lib/ai/tools/jupiter/types';

interface SwapQuoteCardProps {
  result: {
    success: boolean;
    data: OrderResponse;
    metadata?: {
      hasTransaction: boolean;
      isGasless: boolean;
      router: string;
    };
  };
}

function formatAmount(amount: string, decimals: number = 9): string {
  const value = Number(amount) / Math.pow(10, decimals);
  return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

function formatUSD(value: number | undefined): string {
  if (!value) return 'N/A';
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPercent(value: number | undefined): string {
  if (value === undefined) return 'N/A';
  return `${value.toFixed(3)}%`;
}

function Stat({ label, value, warning }: { label: string; value: string | number; warning?: boolean }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`font-semibold ${warning ? 'text-yellow-500' : ''}`}>{value}</div>
    </div>
  );
}

export function SwapQuoteCard({ result }: SwapQuoteCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!result.success || !result.data) {
    return (
      <Card className="vet-glass-card">
        <CardContent className="pt-6">
          <p className="text-red-500">
            {result.data?.errorMessage || 'Failed to get swap quote'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const quote = result.data;
  const priceImpact = quote.priceImpact || 0;
  const isHighImpact = priceImpact > 1;
  const hasError = Boolean(quote.errorCode);

  return (
    <Card className="vet-glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Swap Quote</CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-blue-500 hover:bg-blue-600 capitalize">
              {quote.router}
            </Badge>
            {quote.gasless && (
              <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Gasless
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Error Message */}
        {hasError && quote.errorMessage && (
          <div className="flex items-start gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <div className="font-semibold text-red-500">Error</div>
              <div className="text-sm">{quote.errorMessage}</div>
            </div>
          </div>
        )}

        {/* Input/Output Amounts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
            <div>
              <div className="text-sm text-muted-foreground">You Pay</div>
              <div className="text-2xl font-bold">{formatAmount(quote.inAmount)}</div>
              {quote.inUsdValue && (
                <div className="text-sm text-muted-foreground">{formatUSD(quote.inUsdValue)}</div>
              )}
            </div>
            <code className="text-xs bg-background px-2 py-1 rounded">{quote.inputMint.slice(0, 8)}...</code>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="w-6 h-6 text-muted-foreground" />
          </div>

          <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div>
              <div className="text-sm text-muted-foreground">You Receive</div>
              <div className="text-2xl font-bold text-green-500">{formatAmount(quote.outAmount)}</div>
              {quote.outUsdValue && (
                <div className="text-sm text-muted-foreground">{formatUSD(quote.outUsdValue)}</div>
              )}
            </div>
            <code className="text-xs bg-background px-2 py-1 rounded">{quote.outputMint.slice(0, 8)}...</code>
          </div>
        </div>

        {/* Price Impact Warning */}
        {isHighImpact && (
          <div className="flex items-start gap-2 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <div className="font-semibold text-yellow-500">High Price Impact</div>
              <div className="text-sm">
                This swap has a {formatPercent(priceImpact)} price impact. Consider splitting into smaller trades.
              </div>
            </div>
          </div>
        )}

        {/* Route Plan */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Route Plan ({quote.routePlan.length} step{quote.routePlan.length !== 1 ? 's' : ''})
          </h4>
          <div className="space-y-2">
            {quote.routePlan.map((step, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                <div className="min-w-[60px] text-center">
                  <div className="text-xs text-muted-foreground">Split</div>
                  <div className="font-bold">{step.percent}%</div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{step.swapInfo.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatAmount(step.swapInfo.inAmount)} → {formatAmount(step.swapInfo.outAmount)}
                  </div>
                </div>
                <div className="text-xs">
                  <div className="text-muted-foreground">Fee</div>
                  <div>{formatAmount(step.swapInfo.feeAmount, 6)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote Stats */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Quote Details</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Stat
              label="Price Impact"
              value={formatPercent(priceImpact)}
              warning={isHighImpact}
            />
            <Stat label="Slippage" value={`${(quote.slippageBps / 100).toFixed(2)}%`} />
            <Stat label="Min Received" value={formatAmount(quote.otherAmountThreshold)} />
          </div>
        </div>

        {/* Fees Breakdown */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Fees</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat
              label="Network Fee"
              value={`${(quote.signatureFeeLamports / 1e9).toFixed(6)} SOL`}
            />
            <Stat
              label="Priority Fee"
              value={`${(quote.prioritizationFeeLamports / 1e9).toFixed(6)} SOL`}
            />
            <Stat
              label="Rent (est.)"
              value={`${(quote.rentFeeLamports / 1e9).toFixed(6)} SOL`}
            />
            <Stat label="Platform Fee" value={`${(quote.feeBps / 100).toFixed(2)}%`} />
          </div>
          {quote.platformFee && (
            <div className="mt-3 p-3 bg-secondary/30 rounded-lg">
              <div className="text-xs text-muted-foreground">Platform Fee Amount</div>
              <div className="font-semibold">{formatAmount(quote.platformFee.amount)} ({(quote.platformFee.feeBps / 100).toFixed(2)}%)</div>
            </div>
          )}
        </div>

        {/* Transaction Info */}
        {quote.transaction && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold mb-3">Transaction</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge className="bg-green-500 hover:bg-green-600">Ready to Sign</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Request ID</span>
                <code className="text-xs bg-secondary px-2 py-1 rounded">{quote.requestId}</code>
              </div>
              {quote.taker && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taker</span>
                  <code className="text-xs bg-secondary px-2 py-1 rounded">
                    {quote.taker.slice(0, 8)}...{quote.taker.slice(-8)}
                  </code>
                </div>
              )}
              {quote.expireAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expires At</span>
                  <span>{new Date(quote.expireAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quote-only message */}
        {!quote.transaction && !hasError && (
          <div className="p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg text-sm">
            💡 This is a quote only. To get a transaction ready to sign, include the taker wallet address.
          </div>
        )}

        {/* Metadata */}
        <div className="border-t pt-4">
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Quote generated in {quote.totalTime}ms</div>
            {quote.quoteId && <div>Quote ID: {quote.quoteId}</div>}
            <div>Mode: {quote.mode} | Swap Mode: {quote.swapMode}</div>
          </div>
        </div>

        {/* Execute Swap Button */}
        {!hasError && (
          <div className="border-t pt-4">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-vet-accent hover:bg-vet-accent/90 text-white font-semibold py-6 text-lg flex items-center justify-center gap-2"
              size="lg"
            >
              <Rocket className="w-5 h-5" />
              Execute Swap
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Opens Jupiter swap interface with pre-filled parameters
            </p>
          </div>
        )}
      </CardContent>

      {/* Swap Execution Modal */}
      <SwapExecutionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        inputMint={quote.inputMint}
        outputMint={quote.outputMint}
        amount={quote.inAmount}
        onSuccess={(txid) => {
          console.log('[SwapQuoteCard] Swap successful:', txid);
        }}
        onError={(error) => {
          console.error('[SwapQuoteCard] Swap failed:', error);
        }}
      />
    </Card>
  );
}
