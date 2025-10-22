'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink } from 'lucide-react';
import type { DBCPoolAddressesResponse } from '@/lib/ai/tools/jupiter/types';

interface DBCPoolCardProps {
  result: {
    success: boolean;
    data?: {
      dammv2PoolAddress: string | null;
      dbcPoolAddress: string | null;
      configKey: string | null;
    };
    metadata?: {
      mint: string;
    };
  };
}

function CopyableAddress({ label, address }: { label: string; address: string | null }) {
  if (!address) {
    return (
      <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Badge variant="outline">Not Available</Badge>
      </div>
    );
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
  };

  return (
    <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg hover:bg-secondary/40 transition-colors">
      <div className="flex-1 mr-3">
        <div className="text-xs text-muted-foreground mb-1">{label}</div>
        <code className="text-xs break-all">{address}</code>
      </div>
      <div className="flex gap-2">
        <button
          onClick={copyToClipboard}
          className="p-2 hover:bg-secondary rounded transition-colors"
          title="Copy to clipboard"
        >
          <Copy className="w-4 h-4" />
        </button>
        <a
          href={`https://solscan.io/account/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-secondary rounded transition-colors"
          title="View on Solscan"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

export function DBCPoolCard({ result }: DBCPoolCardProps) {
  if (!result.success || !result.data) {
    return (
      <Card className="vet-glass-card">
        <CardContent className="pt-6">
          <p className="text-red-500">Pool addresses not found for this token</p>
        </CardContent>
      </Card>
    );
  }

  const hasAnyPool =
    result.data.dammv2PoolAddress ||
    result.data.dbcPoolAddress ||
    result.data.configKey;

  return (
    <Card className="vet-glass-card">
      <CardHeader>
        <CardTitle>DBC Pool Addresses</CardTitle>
        <p className="text-sm text-muted-foreground">
          Dynamic Bonding Curve pool information for this token
        </p>
      </CardHeader>

      <CardContent className="max-h-[600px] overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-vet-accent/20 scrollbar-track-transparent hover:scrollbar-thumb-vet-accent/40">
        {!hasAnyPool ? (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm">This token does not have DBC pool addresses configured.</p>
          </div>
        ) : (
          <>
            <CopyableAddress label="DAMM v2 Pool Address" address={result.data.dammv2PoolAddress} />
            <CopyableAddress label="DBC Pool Address" address={result.data.dbcPoolAddress} />
            <CopyableAddress label="Config Key" address={result.data.configKey} />
          </>
        )}

        {result.metadata?.mint && (
          <div className="border-t pt-4">
            <div className="text-xs text-muted-foreground mb-2">Token Mint</div>
            <code className="text-xs bg-secondary px-3 py-2 rounded block break-all">
              {result.metadata.mint}
            </code>
          </div>
        )}

        <div className="border-t pt-4 text-sm text-muted-foreground space-y-1">
          <div className="font-semibold mb-2">About DBC Pools</div>
          <p>
            Dynamic Bonding Curve (DBC) pools use an automated market maker mechanism to provide liquidity
            and price discovery for tokens.
          </p>
          <p className="mt-2">
            These addresses are used for advanced pool interactions and analytics.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
