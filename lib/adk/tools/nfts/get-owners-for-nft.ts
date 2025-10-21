/**
 * Get Owners for NFT Tool
 *
 * ADK FunctionTool for getting all owners of a specific NFT
 * Useful for ERC1155 tokens that can have multiple owners
 */

/**
 * Get Owners for NFT Tool
 *
 * ADK FunctionTool for getting all owners of a specific NFT
 * Useful for ERC1155 tokens that can have multiple owners
 */

import { createTool } from '@iqai/adk';
import { z } from 'zod';

export const getOwnersForNftTool = createTool({
  name: 'get_owners_for_nft',
  description: 'Get all owners of a specific NFT. Useful for ERC1155 tokens that can have multiple owners.',
  schema: z.object({
    contractAddress: z.string().describe('The NFT contract address (0x...)'),
    tokenId: z.string().describe('The token ID'),
    chainId: z.number().optional().default(1).describe('The chain ID (1=Ethereum, 8453=Base, etc.)'),
  }),
  fn: async ({ contractAddress, tokenId, chainId = 1 }, context) => {
    try {
      // Validate address format
      if (!contractAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
        return {
          success: false,
          error: 'Invalid contract address format',
        };
      }

      const apiKey = process.env.ALCHEMY_API_KEY || process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
      if (!apiKey) {
        return {
          success: false,
          error: 'Alchemy API key not configured',
        };
      }

      // Determine network endpoint
      const networks: Record<number, string> = {
        1: 'eth-mainnet',
        11155111: 'eth-sepolia',
        8453: 'base-mainnet',
        84532: 'base-sepolia',
        137: 'polygon-mainnet',
        80002: 'polygon-amoy',
      };

      const network = networks[chainId] || 'eth-mainnet';
      const url = `https://${network}.g.alchemy.com/nft/v3/${apiKey}/getOwnersForNFT?contractAddress=${contractAddress}&tokenId=${tokenId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Alchemy API error: ${response.status}`,
        };
      }

      const data = await response.json();

      return {
        success: true,
        data: {
          contractAddress,
          tokenId,
          chainId,
          owners: data.owners || [],
          totalOwners: (data.owners || []).length,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch NFT owners',
      };
    }
  }
});
