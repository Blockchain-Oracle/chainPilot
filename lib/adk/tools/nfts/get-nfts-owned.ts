import { createTool } from '@iqai/adk';
import { getAlchemyService } from '@/lib/services/alchemy';
import { z } from 'zod';

export const nftsOwnedTool = createTool({
  name: 'get_nfts_owned',
  description: 'Get all NFTs owned by a wallet address on any supported chain',
  schema: z.object({
    address: z.string().describe('The wallet address to check NFTs for (0x...)'),
    chainId: z.number().optional().default(1).describe('The chain ID (1=Ethereum, 8453=Base, 137=Polygon, etc.)'),
  }),
  fn: async ({ address, chainId = 1 }, context) => {
    // Track query in conversation state
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'get_nfts_owned',
      params: { address, chainId },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    // Remember last query details for context persistence
    context.state.set('last_queried_tool', 'get_nfts_owned');
    context.state.set('last_address', address);
    context.state.set('last_chain_id', chainId);

    try {
      const alchemy = getAlchemyService();

      // Validate address format
      if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
        return {
          success: false,
          error: 'Invalid Ethereum address format',
        };
      }

      const nfts = await alchemy.getNFTsOwned(address, chainId);

      // Group NFTs by collection
      const collections = nfts.reduce((acc, nft) => {
        if (!acc[nft.collection]) {
          acc[nft.collection] = {
            name: nft.collection,
            contract: nft.contract,
            tokenType: nft.tokenType,
            nfts: [],
          };
        }
        acc[nft.collection].nfts.push(nft);
        return acc;
      }, {} as Record<string, any>);

      const result = {
        success: true,
        data: {
          address,
          chainId,
          totalNFTs: nfts.length,
          collections: Object.values(collections),
          nfts,
        },
      };

      // Store result in state before returning
      context.state.set('last_result', result.data);
      context.state.set('last_nfts_owned', nfts);

      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch NFTs',
      };
    }
  }
});