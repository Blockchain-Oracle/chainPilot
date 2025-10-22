/**
 * Get Collections for Owner Tool
 *
 * ADK FunctionTool for getting all NFT collections owned by an address
 * Returns collection-level data with balance and distinct token counts
 */

/**
 * Get Collections for Owner Tool
 *
 * ADK FunctionTool for getting all NFT collections owned by an address
 * Returns collection-level data with balance and distinct token counts
 */

import { createTool } from '@iqai/adk';
import { z } from 'zod';

export const getCollectionsForOwnerTool = createTool({
  name: 'get_collections_for_owner',
  description: 'Get all NFT collections owned by a wallet address, including balance and distinct token counts',
  schema: z.object({
    owner: z.string().describe('The wallet address (0x...)'),
    chainId: z.number().optional().default(1).describe('The chain ID (1=Ethereum, 8453=Base, etc.)'),
    limit: z.number().optional().default(100).describe('Number of collections to return (max 100)'),
  }),
  fn: async ({ owner, chainId = 1, limit = 100 }, context) => {
    // Track query in conversation state
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'get_collections_for_owner',
      params: { owner, chainId, limit },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    // Remember last query details for context persistence
    context.state.set('last_queried_tool', 'get_collections_for_owner');
    context.state.set('last_owner', owner);
    context.state.set('last_chain_id', chainId);

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

      const result = {
        success: true,
        data: {
          owner,
          chainId,
          collections,
          totalCollections: data.totalCount || collections.length,
          hasMore: !!data.pageKey,
        },
      };

      // Store result in state before returning
      context.state.set('last_result', result.data);
      context.state.set('last_collections', collections);

      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch collections',
      };
    }
  }
});
