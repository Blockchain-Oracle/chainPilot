"use client";

import { Card } from "@/components/ui/card";

export default function ExamplesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Examples</h1>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Alchemy Terminal Examples</h2>
        <p className="text-muted-foreground mb-4">
          Here are some example queries you can try with the Alchemy Terminal:
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Multi-Chain Balance Check</h3>
            <code className="block bg-muted p-2 rounded text-sm">
              "What's my balance across all chains?"
            </code>
          </div>

          <div>
            <h3 className="font-semibold">NFT Portfolio</h3>
            <code className="block bg-muted p-2 rounded text-sm">
              "Show me my NFTs on Ethereum and Base"
            </code>
          </div>

          <div>
            <h3 className="font-semibold">Gas Optimization</h3>
            <code className="block bg-muted p-2 rounded text-sm">
              "What's the current gas price on Arbitrum?"
            </code>
          </div>

          <div>
            <h3 className="font-semibold">Transaction History</h3>
            <code className="block bg-muted p-2 rounded text-sm">
              "Show my recent transactions on Polygon"
            </code>
          </div>

          <div>
            <h3 className="font-semibold">ENS Resolution</h3>
            <code className="block bg-muted p-2 rounded text-sm">
              "Resolve vitalik.eth"
            </code>
          </div>

          <div>
            <h3 className="font-semibold">Token Information</h3>
            <code className="block bg-muted p-2 rounded text-sm">
              "Get USDC token metadata on Base"
            </code>
          </div>
        </div>
      </Card>
    </div>
  );
}