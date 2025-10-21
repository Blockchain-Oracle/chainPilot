import { BaseTool } from '@iqai/adk';

// Token tools
import { tokenBalanceTool } from './tokens/get-token-balance';
import { tokenMetadataTool } from './tokens/get-token-metadata';
import { tokenPriceTool } from './tokens/get-token-price';
import { tokenPriceByAddressTool } from './tokens/get-token-price-by-address';

// NFT tools
import { nftsOwnedTool } from './nfts/get-nfts-owned';
import { getOwnersForNftTool } from './nfts/get-owners-for-nft';
import { getCollectionsForOwnerTool } from './nfts/get-collections-for-owner';
import { getNftMetadataTool } from './nfts/get-nft-metadata';
import { getContractMetadataTool } from './nfts/get-contract-metadata';
import { getFloorPriceTool } from './nfts/get-floor-price';

// Account tools
import { balanceTool } from './account/get-balance';
import { transactionHistoryTool } from './account/get-transaction-history';

// Transaction tools (read-only)
import { estimateGasTool } from './transactions/estimate-gas';

// Transaction preparation tools (write)
import { prepareEthTransferTool } from './transactions/prepare-eth-transfer';
import { prepareTokenTransferTool } from './transactions/prepare-token-transfer';
import { prepareTokenApprovalTool } from './transactions/prepare-token-approval';
import { prepareContractCallTool } from './transactions/prepare-contract-call';

// Utility tools
import { ensResolverTool } from './utils/resolve-ens';
import { gasPriceTool } from './utils/get-gas-price';

// Export all tools as an array
export const alchemyTools: BaseTool[] = [
  // Token operations
  tokenBalanceTool,
  tokenMetadataTool,
  tokenPriceTool,
  tokenPriceByAddressTool,

  // NFT operations
  nftsOwnedTool,
  getOwnersForNftTool,
  getCollectionsForOwnerTool,
  getNftMetadataTool,
  getContractMetadataTool,
  getFloorPriceTool,

  // Account operations
  balanceTool,
  transactionHistoryTool,

  // Transaction operations (read-only)
  estimateGasTool,

  // Transaction preparation (write operations)
  prepareEthTransferTool,
  prepareTokenTransferTool,
  prepareTokenApprovalTool,
  prepareContractCallTool,

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
  tokenPriceByAddressTool,

  // NFT tools
  nftsOwnedTool,
  getOwnersForNftTool,
  getCollectionsForOwnerTool,
  getNftMetadataTool,
  getContractMetadataTool,
  getFloorPriceTool,

  // Account tools
  balanceTool,
  transactionHistoryTool,

  // Transaction tools (read-only)
  estimateGasTool,

  // Transaction preparation tools (write)
  prepareEthTransferTool,
  prepareTokenTransferTool,
  prepareTokenApprovalTool,
  prepareContractCallTool,

  // Utility tools
  ensResolverTool,
  gasPriceTool,
};

// Tool categories for UI organization
export const toolCategories = {
  tokens: [tokenBalanceTool, tokenMetadataTool, tokenPriceTool, tokenPriceByAddressTool],
  nfts: [
    nftsOwnedTool,
    getOwnersForNftTool,
    getCollectionsForOwnerTool,
    getNftMetadataTool,
    getContractMetadataTool,
    getFloorPriceTool,
  ],
  account: [balanceTool, transactionHistoryTool],
  transactions: [
    estimateGasTool,
    prepareEthTransferTool,
    prepareTokenTransferTool,
    prepareTokenApprovalTool,
    prepareContractCallTool,
  ],
  utilities: [ensResolverTool, gasPriceTool],
};

// Helper function to get Alchemy tools
export async function getAlchemyTools(): Promise<BaseTool[]> {
  // Return all Alchemy tools
  // In future, could add conditional logic here based on configuration
  return alchemyTools;
}