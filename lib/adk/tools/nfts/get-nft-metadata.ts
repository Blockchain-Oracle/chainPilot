/**
 * Get NFT Metadata Tool
 *
 * ADK FunctionTool for getting metadata for a specific NFT (contract + tokenId)
 * Returns detailed metadata including images, attributes, descriptions
 */

/**
 * Get NFT Metadata Tool
 *
 * ADK FunctionTool for getting metadata for a specific NFT (contract + tokenId)
 * Returns detailed metadata including images, attributes, descriptions
 */

import { createTool } from '@iqai/adk';
import { z } from 'zod';

export const getNftMetadataTool = createTool({
  name: 'get_nft_metadata',
  description: 'Get detailed metadata for a specific NFT including images, attributes, and descriptions',
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
      const url = `https://${network}.g.alchemy.com/nft/v3/${apiKey}/getNFTMetadata?contractAddress=${contractAddress}&tokenId=${tokenId}`;

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

      const nft = await response.json();

      return {
        success: true,
        data: {
          contract: {
            address: nft.contract?.address,
            name: nft.contract?.name,
            symbol: nft.contract?.symbol,
            tokenType: nft.contract?.tokenType,
            totalSupply: nft.contract?.totalSupply,
            openSeaMetadata: nft.contract?.openSeaMetadata,
          },
          tokenId: nft.tokenId,
          tokenType: nft.tokenType,
          name: nft.name,
          description: nft.description,
          image: {
            cachedUrl: nft.image?.cachedUrl,
            thumbnailUrl: nft.image?.thumbnailUrl,
            pngUrl: nft.image?.pngUrl,
            originalUrl: nft.image?.originalUrl,
            contentType: nft.image?.contentType,
          },
          attributes: nft.raw?.metadata?.attributes || [],
          tokenUri: nft.tokenUri,
          timeLastUpdated: nft.timeLastUpdated,
          chainId,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch NFT metadata',
      };
    }
  }
});
