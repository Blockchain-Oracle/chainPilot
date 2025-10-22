'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import type { MintInformation } from '@/lib/ai/tools/jupiter/types';

interface TokenSearchCardProps {
  result: {
    success: boolean;
    data: MintInformation[];
    metadata?: {
      count: number;
      query: string;
    };
  };
}

function formatMoney(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  return value.toLocaleString();
}

function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  const formatted = value.toFixed(2);
  return value >= 0 ? `+${formatted}%` : `${formatted}%`;
}

function Stat({ label, value, positive, negative }: { label: string; value: string | number; positive?: boolean; negative?: boolean }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`font-semibold ${positive ? 'text-green-500' : negative ? 'text-red-500' : ''}`}>
        {value}
      </div>
    </div>
  );
}

function SafetyIndicator({ label, safe }: { label: string; safe: boolean | null | undefined }) {
  if (safe === null || safe === undefined) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="w-4 h-4 rounded-full bg-gray-500" />
        <span className="text-muted-foreground">{label}: Unknown</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {safe ? (
        <>
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span>{label}</span>
        </>
      ) : (
        <>
          <XCircle className="w-4 h-4 text-red-500" />
          <span className="text-red-500">{label}</span>
        </>
      )}
    </div>
  );
}

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm text-blue-500 hover:underline"
    >
      {label}
      <ExternalLink className="w-3 h-3" />
    </a>
  );
}

function TokenCard({ token }: { token: MintInformation }) {
  const priceChange = token.stats24h?.priceChange;
  const isPriceUp = (priceChange ?? 0) >= 0;

  return (
    <Card className="vet-glass-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {token.icon && (
              <img
                src={token.icon}
                alt={token.symbol}
                className="w-12 h-12 rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <div>
              <CardTitle className="text-xl">{token.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{token.symbol}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {token.isVerified && (
              <Badge className="bg-blue-500 hover:bg-blue-600">Verified</Badge>
            )}
            <Badge
              className={
                token.organicScoreLabel === 'high'
                  ? 'bg-green-500 hover:bg-green-600'
                  : token.organicScoreLabel === 'medium'
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-red-500 hover:bg-red-600'
              }
            >
              {token.organicScoreLabel} organic
            </Badge>
            {token.audit?.isSus && (
              <Badge className="bg-red-500 hover:bg-red-600 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Suspicious
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Price Section */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Price & Market</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">Price</div>
              <div className="font-bold text-lg">
                {token.usdPrice ? `$${token.usdPrice.toFixed(6)}` : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">24h Change</div>
              <div className={`font-semibold flex items-center gap-1 ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
                {isPriceUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {formatPercent(priceChange)}
              </div>
            </div>
            <Stat label="Market Cap" value={formatMoney(token.mcap)} />
            <Stat label="FDV" value={formatMoney(token.fdv)} />
          </div>
        </div>

        {/* Trading Stats */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Trading (24h)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat label="Volume" value={formatMoney(token.stats24h?.volumeChange)} />
            <Stat label="Liquidity" value={formatMoney(token.liquidity)} />
            <Stat label="Traders" value={formatNumber(token.stats24h?.numTraders)} />
            <Stat label="Holders" value={formatNumber(token.holderCount)} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <Stat label="Buys" value={formatNumber(token.stats24h?.numBuys)} />
            <Stat label="Sells" value={formatNumber(token.stats24h?.numSells)} />
            <Stat
              label="Net Buyers"
              value={formatNumber(token.stats24h?.numNetBuyers)}
              positive={(token.stats24h?.numNetBuyers ?? 0) > 0}
              negative={(token.stats24h?.numNetBuyers ?? 0) < 0}
            />
            <Stat label="Organic Buyers" value={formatNumber(token.stats24h?.numOrganicBuyers)} />
          </div>
        </div>

        {/* Safety Audit */}
        {token.audit && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              Safety Audit
              <span className="text-xs font-normal text-muted-foreground">
                (Score: {token.organicScore}/100)
              </span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <SafetyIndicator label="Mint Authority Disabled" safe={token.audit.mintAuthorityDisabled} />
              <SafetyIndicator label="Freeze Authority Disabled" safe={token.audit.freezeAuthorityDisabled} />
              <Stat label="Top Holders" value={`${token.audit.topHoldersPercentage?.toFixed(1) ?? 'N/A'}%`} />
              <Stat label="Dev Balance" value={`${token.audit.devBalancePercentage?.toFixed(1) ?? 'N/A'}%`} />
            </div>
          </div>
        )}

        {/* Volume Breakdown */}
        {token.stats24h && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold mb-3">Volume Breakdown (24h)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat label="Buy Volume" value={formatMoney(token.stats24h.buyVolume)} />
              <Stat label="Sell Volume" value={formatMoney(token.stats24h.sellVolume)} />
              <Stat label="Organic Buy" value={formatMoney(token.stats24h.buyOrganicVolume)} />
              <Stat label="Organic Sell" value={formatMoney(token.stats24h.sellOrganicVolume)} />
            </div>
          </div>
        )}

        {/* Social & Links */}
        {(token.twitter || token.telegram || token.website) && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold mb-3">Links</h4>
            <div className="flex flex-wrap gap-4">
              {token.twitter && <SocialLink href={token.twitter} label="Twitter" />}
              {token.telegram && <SocialLink href={token.telegram} label="Telegram" />}
              {token.website && <SocialLink href={token.website} label="Website" />}
            </div>
          </div>
        )}

        {/* Token Info */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold mb-3">Token Info</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mint Address</span>
              <code className="text-xs bg-secondary px-2 py-1 rounded">{token.id}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Decimals</span>
              <span>{token.decimals}</span>
            </div>
            {token.circSupply && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Circulating Supply</span>
                <span>{formatNumber(token.circSupply)}</span>
              </div>
            )}
            {token.totalSupply && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Supply</span>
                <span>{formatNumber(token.totalSupply)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tags & CEX Listings */}
        {(token.tags || token.cexes) && (
          <div className="border-t pt-4">
            {token.tags && token.tags.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-semibold mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {token.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {token.cexes && token.cexes.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Listed on CEXs</h4>
                <div className="flex flex-wrap gap-2">
                  {token.cexes.map((cex) => (
                    <Badge key={cex} className="bg-purple-500 hover:bg-purple-600">
                      {cex}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function TokenSearchCard({ result }: TokenSearchCardProps) {
  if (!result.success || !result.data || result.data.length === 0) {
    return (
      <Card className="vet-glass-card">
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">No tokens found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {result.metadata && (
        <div className="text-sm text-muted-foreground">
          Found {result.metadata.count} token{result.metadata.count !== 1 ? 's' : ''} for "{result.metadata.query}"
        </div>
      )}
      {result.data.map((token) => (
        <TokenCard key={token.id} token={token} />
      ))}
    </div>
  );
}
