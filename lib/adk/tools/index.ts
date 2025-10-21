import { BaseTool } from '@iqai/adk';

// Token tools
import { tokenBalanceTool } from './tokens/get-token-balance';
import { tokenMetadataTool } from './tokens/get-token-metadata';
import { tokenPriceTool } from './tokens/get-token-price';

// NFT tools
import { nftsOwnedTool } from './nfts/get-nfts-owned';

// Account tools
import { balanceTool } from './account/get-balance';
import { transactionHistoryTool } from './account/get-transaction-history';

// Transaction tools
import { estimateGasTool } from './transactions/estimate-gas';

// Utility tools
import { ensResolverTool } from './utils/resolve-ens';
import { gasPriceTool } from './utils/get-gas-price';

// Export all tools as an array
export const alchemyTools: BaseTool[] = [
  // Token operations
  tokenBalanceTool,
  tokenMetadataTool,
  tokenPriceTool,

  // NFT operations
  nftsOwnedTool,

  // Account operations
  balanceTool,
  transactionHistoryTool,

  // Transaction operations
  estimateGasTool,

  // Utility operations
  ensResolverTool,
  gasPriceTool,
];

// Export individual tools for granular usage
export {
  // Token tools
  tokenBalanceTool,
  tokenMetadataTool,
  tokenPriceTool,

  // NFT tools
  nftsOwnedTool,

  // Account tools
  balanceTool,
  transactionHistoryTool,

  // Transaction tools
  estimateGasTool,

  // Utility tools
  ensResolverTool,
  gasPriceTool,
};

// Tool categories for UI organization
export const toolCategories = {
  tokens: [tokenBalanceTool, tokenMetadataTool, tokenPriceTool],
  nfts: [nftsOwnedTool],
  account: [balanceTool, transactionHistoryTool],
  transactions: [estimateGasTool],
  utilities: [ensResolverTool, gasPriceTool],
};

// Helper function to get Alchemy tools
export async function getAlchemyTools(): Promise<BaseTool[]> {
  // Return all Alchemy tools
  // In future, could add conditional logic here based on configuration
  return alchemyTools;
}