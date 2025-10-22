/**
 * TypeScript type definitions for Jupiter Ultra API
 * Documentation: https://station.jup.ag/docs/apis/ultra-api
 *
 * Base URLs:
 * - Free tier: https://lite-api.jup.ag/ultra/v1
 * - Paid tier: https://api.jup.ag/ultra/v1 (with API key)
 */

// ============================================
// Common Types
// ============================================

export type OrganicScoreLabel = 'high' | 'medium' | 'low';
export type RouterType = 'aggregator' | 'metis' | 'jupiterz' | 'dflow' | 'okx';

// ============================================
// Token Search Types (/search)
// ============================================

export interface SwapStats {
  priceChange: number | null;
  holderChange: number | null;
  liquidityChange: number | null;
  volumeChange: number | null;
  buyVolume: number | null;
  sellVolume: number | null;
  buyOrganicVolume: number | null;
  sellOrganicVolume: number | null;
  numBuys: number | null;
  numSells: number | null;
  numTraders: number | null;
  numOrganicBuyers: number | null;
  numNetBuyers: number | null;
}

export interface TokenAudit {
  isSus: boolean | null;
  mintAuthorityDisabled: boolean | null;
  freezeAuthorityDisabled: boolean | null;
  topHoldersPercentage: number | null;
  devBalancePercentage: number | null;
  devMigrations: number | null;
}

export interface TokenFirstPool {
  id: string;
  createdAt: string;
}

export interface MintInformation {
  id: string;                        // Token's mint address
  name: string;
  symbol: string;
  icon: string | null;
  decimals: number;
  twitter: string | null;
  telegram: string | null;
  website: string | null;
  dev: string | null;                // Developer address
  circSupply: number | null;         // Circulating supply
  totalSupply: number | null;
  tokenProgram: string;              // Token program address
  launchpad: string | null;
  partnerConfig: string | null;
  graduatedPool: string | null;
  graduatedAt: string | null;
  holderCount: number | null;
  fdv: number | null;                // Fully diluted valuation
  mcap: number | null;               // Market cap
  usdPrice: number | null;
  priceBlockId: number | null;
  liquidity: number | null;
  stats5m: SwapStats | null;
  stats1h: SwapStats | null;
  stats6h: SwapStats | null;
  stats24h: SwapStats | null;
  firstPool: TokenFirstPool | null;
  audit: TokenAudit | null;
  organicScore: number;
  organicScoreLabel: OrganicScoreLabel;
  isVerified: boolean | null;
  cexes: string[] | null;            // Centralized exchanges listing this token
  tags: string[] | null;
  updatedAt: string;                 // ISO 8601 date-time
}

export interface TokenSearchRequest {
  query: string;  // Search by symbol, name, or mint address (comma-separated, max 100)
}

export type TokenSearchResponse = MintInformation[];

// ============================================
// Order/Quote Types (/order)
// ============================================

export interface SwapInfo {
  ammKey: string;
  label: string;              // DEX name (e.g., "Raydium", "Orca")
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  feeAmount: string;
  feeMint: string;
}

export interface RoutePlanStep {
  swapInfo: SwapInfo;
  percent: number;            // Percentage of total amount through this route
  bps: number;                // Basis points
}

export interface PlatformFee {
  amount: string;
  feeBps: number;
}

export type OrderErrorCode = 1 | 2 | 3;

export type OrderErrorMessage =
  | 'Insufficient funds'
  | 'Top up `${solAmount}` SOL for gas'
  | 'Minimum `${swapAmount}` for gasless';

export interface OrderRequest {
  inputMint: string;          // Input token mint address
  outputMint: string;         // Output token mint address
  amount: string;             // Amount in smallest unit (considering decimals)
  taker?: string;             // Taker wallet address (optional for quote-only)
  referralAccount?: string;   // Referral account for integrator fees
  referralFee?: number;       // Referral fee in bps (50-255)
  excludeRouters?: RouterType[]; // Routers to exclude
  excludeDexes?: string;      // Comma-separated DEX labels to exclude
  payer?: string;             // External gas payer address
}

export interface OrderResponse {
  mode: string;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  inUsdValue?: number;
  outUsdValue?: number;
  priceImpact?: number;
  swapUsdValue?: number;
  priceImpactPct: string;     // Deprecated, use priceImpact instead
  routePlan: RoutePlanStep[];
  feeMint: string;
  feeBps: number;
  signatureFeeLamports: number;    // Base network fee
  prioritizationFeeLamports: number; // Priority fees + tips (Jito, etc.)
  rentFeeLamports: number;         // Rent fee (estimate)
  swapType: string;                // Deprecated, use router
  router: RouterType;
  transaction: string | null;      // Base64 encoded unsigned transaction
  gasless: boolean;
  requestId: string;               // Required for /execute
  totalTime: number;
  taker: string | null;
  quoteId?: string;
  maker?: string;
  expireAt?: string;
  platformFee?: PlatformFee;
  errorCode?: OrderErrorCode;
  errorMessage?: OrderErrorMessage;
}

// ============================================
// Router Types (/order/routers)
// ============================================

export type RouterName =
  | 'Metis v1.6'
  | 'JupiterZ'
  | 'DFlow'
  | 'OKX DEX Router';

export interface Router {
  id: string;
  name: RouterName;
  icon?: string;
}

export type RoutersResponse = Router[];

// ============================================
// DBC Pool Types (/dbc-pool/addresses/{mint})
// ============================================

export interface DBCPoolAddressesRequest {
  mint: string;  // Token mint address
}

export interface DBCPoolAddressesData {
  dammv2PoolAddress: string | null;
  dbcPoolAddress: string | null;
  configKey: string | null;
}

export interface DBCPoolAddressesResponse {
  success: boolean;
  data?: DBCPoolAddressesData;
}

// ============================================
// Error Response Types
// ============================================

export interface JupiterErrorResponse {
  error: string;
}

export interface JupiterValidationError {
  errors: Record<string, any>;
}

// ============================================
// API Configuration
// ============================================

export interface JupiterAPIConfig {
  apiKey?: string;
  tier: 'free' | 'paid';
}

export const JUPITER_BASE_URLS = {
  free: 'https://lite-api.jup.ag',
  paid: 'https://api.jup.ag',
} as const;

export const JUPITER_ENDPOINTS = {
  ultra: {
    search: '/ultra/v1/search',
    order: '/ultra/v1/order',
    routers: '/ultra/v1/order/routers',
  },
  studio: {
    dbcPoolAddresses: '/studio/v1/dbc-pool/addresses',
  },
} as const;

// ============================================
// Utility Types
// ============================================

export interface TokenWithStats extends MintInformation {
  // Convenience computed properties
  hasAuditIssues?: boolean;
  isLikelyRugpull?: boolean;
  liquidityUsd?: number;
  volume24hUsd?: number;
}

export interface SwapQuote {
  inputToken: MintInformation;
  outputToken: MintInformation;
  quote: OrderResponse;
  pricePerToken: number;
  priceImpactPercent: number;
  estimatedFeeUsd?: number;
}

// ============================================
// Helper Types for UI Components
// ============================================

export interface TokenMetrics {
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  marketCap: number;
  fdv: number;
  holders: number;
}

export interface TokenSafety {
  organicScore: number;
  organicScoreLabel: OrganicScoreLabel;
  isSus: boolean;
  mintAuthorityDisabled: boolean;
  freezeAuthorityDisabled: boolean;
  topHoldersPercentage: number;
  devBalancePercentage: number;
  isVerified: boolean;
}

export interface TokenSocial {
  twitter?: string;
  telegram?: string;
  website?: string;
}

export interface TokenTrading {
  numBuys24h: number;
  numSells24h: number;
  numTraders24h: number;
  buyVolume24h: number;
  sellVolume24h: number;
  organicBuyers24h: number;
  netBuyers24h: number;
}
