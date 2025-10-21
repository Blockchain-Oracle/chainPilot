/**
 * Get Collections for Owner Tool
 *
 * ADK FunctionTool for getting all NFT collections owned by an address
 * Returns collection-level data with balance and distinct token counts
 */

import { FunctionTool } from '@iqai/adk';
import { z } from 'zod';

const schema = z.object({
  owner: z.string().describe('The wallet address (0x...)'),
  chainId: z.number().optional().default(1).describe('The chain ID (1=Ethereum, 8453=Base, etc.)'),
  limit: z.number().optional().default(100).describe('Number of collections to return (max 100)'),
});

async function getCollectionsForOwner({
  owner,
  chainId = 1,
  limit = 100,
}: z.infer<typeof schema>) {
  try {
    // Validate address format
    if (!owner.match(/^0x[a-fA-F0-9]{40}$/)) {
      return {
        success: false,
        error: 'Invalid wallet address format',
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
    const url = `https://${network}.g.alchemy.com/nft/v3/${apiKey}/getCollectionsForOwner?owner=${owner}&limit=${limit}`;

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

    const collections = (data.collections || []).map((collection: any) => ({
      name: collection.name,
      slug: collection.slug,
      address: collection.address,
      totalBalance: collection.totalBalance,
      numDistinctTokensOwned: collection.numDistinctTokensOwned,
      isSpam: collection.isSpam === 'true',
      image: collection.image,
    }));

    return {
      success: true,
      data: {
        owner,
        chainId,
        collections,
        totalCollections: data.totalCount || collections.length,
        hasMore: !!data.pageKey,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch collections',
    };
  }
}

export const getCollectionsForOwnerTool = new FunctionTool(getCollectionsForOwner, {
  name: 'get_collections_for_owner',
  description: 'Get all NFT collections owned by a wallet address, including balance and distinct token counts',
  parameterTypes: schema.shape,
});
