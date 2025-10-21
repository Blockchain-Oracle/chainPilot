/**
 * Get Floor Price Tool
 *
 * ADK FunctionTool for getting NFT collection floor prices
 * Returns floor prices from multiple marketplaces (OpenSea, LooksRare, etc.)
 */

/**
 * Get Floor Price Tool
 *
 * ADK FunctionTool for getting NFT collection floor prices
 * Returns floor prices from multiple marketplaces (OpenSea, LooksRare, etc.)
 */

import { createTool } from '@iqai/adk';
import { z } from 'zod';

export const getFloorPriceTool = createTool({
  name: 'get_floor_price',
  description: 'Get NFT collection floor prices from multiple marketplaces (OpenSea, LooksRare)',
  schema: z.object({
    contractAddress: z.string().describe('The NFT contract address (0x...)'),
    chainId: z.number().optional().default(1).describe('The chain ID (1=Ethereum, 8453=Base, etc.)'),
  }),
  fn: async ({ contractAddress, chainId = 1 }, context) => {
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
      const url = `https://${network}.g.alchemy.com/nft/v3/${apiKey}/getFloorPrice?contractAddress=${contractAddress}`;

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

      // Extract floor prices from different marketplaces
      const floorPrices: Record<string, number> = {};
      let lowestFloorPrice: number | null = null;
      let lowestMarketplace: string | null = null;

      if (data.openSea?.floorPrice) {
        floorPrices['OpenSea'] = data.openSea.floorPrice;
        if (lowestFloorPrice === null || data.openSea.floorPrice < lowestFloorPrice) {
          lowestFloorPrice = data.openSea.floorPrice;
          lowestMarketplace = 'OpenSea';
        }
      }

      if (data.looksRare?.floorPrice) {
        floorPrices['LooksRare'] = data.looksRare.floorPrice;
        if (lowestFloorPrice === null || data.looksRare.floorPrice < lowestFloorPrice) {
          lowestFloorPrice = data.looksRare.floorPrice;
          lowestMarketplace = 'LooksRare';
        }
      }

      return {
        success: true,
        data: {
          contractAddress,
          chainId,
          floorPrices,
          lowestFloorPrice,
          lowestMarketplace,
          priceCurrency: 'ETH',
          lastUpdated: new Date().toISOString(),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch floor price',
      };
    }
  }
});
