'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Router } from '@/lib/ai/tools/jupiter/types';

interface RoutersCardProps {
  result: {
    success: boolean;
    data: Router[];
    metadata?: {
      count: number;
    };
  };
}

export function RoutersCard({ result }: RoutersCardProps) {
  if (!result.success || !result.data || result.data.length === 0) {
    return (
      <Card className="vet-glass-card">
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">No routers found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="vet-glass-card">
      <CardHeader>
        <CardTitle>Available Swap Routers</CardTitle>
        <p className="text-sm text-muted-foreground">
          Jupiter aggregates the best prices across {result.data.length} routers
        </p>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.data.map((router) => (
            <div
              key={router.id}
              className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              {router.icon && (
                <img
                  src={router.icon}
                  alt={router.name}
                  className="w-10 h-10 rounded-full"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <div className="flex-1">
                <div className="font-semibold">{router.name}</div>
                <code className="text-xs text-muted-foreground">{router.id}</code>
              </div>
              <Badge variant="outline">Active</Badge>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h4 className="font-semibold mb-2">How Routing Works</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Jupiter splits your swap across multiple routers for best prices</li>
            <li>• Each router may use different DEXs (Raydium, Orca, etc.)</li>
            <li>• You can exclude specific routers when getting quotes</li>
            <li>• Route splitting minimizes slippage and price impact</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
