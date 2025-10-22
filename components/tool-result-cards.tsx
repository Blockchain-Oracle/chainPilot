"use client";

import { motion } from "framer-motion";
import {
  Coins,
  Image as ImageIcon,
  TrendingUp,
  Wallet,
  Zap,
  FileText,
  Users,
  Tag
} from "lucide-react";

/**
 * Generative UI Components for Tool Results
 * These components render beautiful cards for tool outputs
 */

// Balance Card
export function BalanceCard({ data }: { data: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="vet-glass-card p-5 max-w-md"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-vet-accent/10 flex items-center justify-center">
            <Wallet className="size-5 text-vet-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-vet-text-primary">Balance</h3>
            <p className="text-xs text-vet-text-muted">{data.chain}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-3xl font-bold text-vet-text-primary">
          {data.balance} {data.symbol}
        </div>
        <div className="text-sm text-vet-text-secondary">
          {data.address?.slice(0, 6)}...{data.address?.slice(-4)}
        </div>
      </div>
    </motion.div>
  );
}

// Token Price Card
export function TokenPriceCard({ data }: { data: any }) {
  const isPositive = data.change24h >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="vet-glass-card p-5 max-w-md"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-vet-accent/10 flex items-center justify-center">
            <TrendingUp className="size-5 text-vet-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-vet-text-primary">{data.symbol} Price</h3>
            <p className="text-xs text-vet-text-muted">{data.name}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-3xl font-bold text-vet-text-primary">
          ${data.price?.toLocaleString()}
        </div>
        <div className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}{data.change24h}% (24h)
        </div>
      </div>
    </motion.div>
  );
}

// NFT Collection Card
export function NFTCollectionCard({ data }: { data: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="vet-glass-card p-5 max-w-md"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="size-10 rounded-full bg-vet-accent/10 flex items-center justify-center shrink-0">
          <ImageIcon className="size-5 text-vet-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-vet-text-primary truncate">{data.name}</h3>
          <p className="text-xs text-vet-text-muted truncate">{data.contractAddress}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-vet-text-muted mb-1">Total NFTs</p>
          <p className="text-lg font-semibold text-vet-text-primary">{data.totalNfts || 0}</p>
        </div>
        {data.floorPrice && (
          <div>
            <p className="text-xs text-vet-text-muted mb-1">Floor Price</p>
            <p className="text-lg font-semibold text-vet-text-primary">{data.floorPrice} ETH</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Gas Price Card
export function GasPriceCard({ data }: { data: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="vet-glass-card p-5 max-w-md"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="size-10 rounded-full bg-vet-accent/10 flex items-center justify-center">
          <Zap className="size-5 text-vet-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-vet-text-primary">Gas Prices</h3>
          <p className="text-xs text-vet-text-muted">{data.chainName || 'Ethereum'}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="text-xs text-vet-text-muted mb-1">Slow</p>
          <p className="text-lg font-semibold text-vet-text-primary">{data.slow}</p>
          <p className="text-xs text-vet-text-muted">Gwei</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-vet-text-muted mb-1">Standard</p>
          <p className="text-lg font-semibold text-vet-accent">{data.standard}</p>
          <p className="text-xs text-vet-text-muted">Gwei</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-vet-text-muted mb-1">Fast</p>
          <p className="text-lg font-semibold text-vet-text-primary">{data.fast}</p>
          <p className="text-xs text-vet-text-muted">Gwei</p>
        </div>
      </div>
    </motion.div>
  );
}

// Transaction Prepared Card
export function TransactionPreparedCard({ data }: { data: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="vet-glass-card p-5 max-w-md border-2 border-vet-accent/20"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="size-10 rounded-full bg-vet-accent/10 flex items-center justify-center">
          <FileText className="size-5 text-vet-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-vet-text-primary">Transaction Prepared</h3>
          <p className="text-xs text-vet-text-muted">{data.type?.replace('_', ' ')}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-vet-text-muted">From</span>
          <span className="text-vet-text-primary font-mono">
            {data.from?.slice(0, 6)}...{data.from?.slice(-4)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-vet-text-muted">To</span>
          <span className="text-vet-text-primary font-mono">
            {data.to?.slice(0, 6)}...{data.to?.slice(-4)}
          </span>
        </div>
        {data.amount && (
          <div className="flex justify-between text-sm">
            <span className="text-vet-text-muted">Amount</span>
            <span className="text-vet-text-primary font-semibold">{data.amount}</span>
          </div>
        )}
        {data.gasEstimate && (
          <div className="flex justify-between text-sm">
            <span className="text-vet-text-muted">Est. Gas</span>
            <span className="text-vet-text-primary">{data.gasEstimate}</span>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-vet-accent/5 rounded-lg border border-vet-accent/10">
        <p className="text-xs text-vet-text-secondary">
          ⚠️ Review transaction details carefully before signing
        </p>
      </div>
    </motion.div>
  );
}

// Generic Data Card (fallback)
export function DataCard({ data }: { data: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="vet-glass-card p-5 max-w-md"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="size-10 rounded-full bg-vet-accent/10 flex items-center justify-center">
          <Tag className="size-5 text-vet-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-vet-text-primary">Result</h3>
        </div>
      </div>

      <pre className="text-sm text-vet-text-secondary bg-vet-surface rounded-lg p-3 overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </motion.div>
  );
}

/**
 * Tool Result Renderer
 * Automatically renders the appropriate card based on tool result type
 */
export function ToolResultCard({ toolName, result }: { toolName: string; result: any }) {
  console.log('[ToolResultCard] Rendering card for:', toolName);
  console.log('[ToolResultCard] Result:', result);

  // Parse result if it's a string
  let data = result;
  if (typeof result === 'string') {
    try {
      data = JSON.parse(result);
    } catch {
      console.log('[ToolResultCard] Failed to parse JSON, returning null');
      return null;
    }
  }

  console.log('[ToolResultCard] Parsed data:', data);

  // If result has success field, extract the data
  if (data.success && data.data) {
    console.log('[ToolResultCard] Extracting data from success response');
    data = data.data;
  } else if (data.success && data.transaction) {
    console.log('[ToolResultCard] Extracting transaction from success response');
    data = data.transaction;
  }

  console.log('[ToolResultCard] Final data for card:', data);
  console.log('[ToolResultCard] Rendering card type for tool:', toolName);

  // Render appropriate card based on tool name
  switch (toolName) {
    case 'get_balance':
      return <BalanceCard data={data} />;

    case 'get_token_price':
    case 'get_token_price_by_address':
      return <TokenPriceCard data={data} />;

    case 'get_nfts_owned':
    case 'get_collections_for_owner':
    case 'get_nft_metadata':
      return <NFTCollectionCard data={data} />;

    case 'get_gas_price':
      return <GasPriceCard data={data} />;

    case 'prepare_eth_transfer':
    case 'prepare_token_transfer':
    case 'prepare_token_approval':
    case 'prepare_contract_call':
      return <TransactionPreparedCard data={data} />;

    default:
      return <DataCard data={data} />;
  }
}
