import { createTool } from '@iqai/adk';
import { getAlchemyService } from '@/lib/services/alchemy';
import { z } from 'zod';
import { Alchemy } from 'alchemy-sdk';

export const tokenMetadataTool = createTool({
  name: 'get_token_metadata',
  description: 'Get metadata for an ERC20 token including name, symbol, decimals, and logo',
  schema: z.object({
    contractAddress: z.string().describe('The token contract address (0x...)'),
    chainId: z.number().optional().default(1).describe('The chain ID (1=Ethereum, 8453=Base, 137=Polygon, etc.)'),
  }),
  fn: async ({ contractAddress, chainId = 1 }, context) => {
    // Track query in conversation state
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'get_token_metadata',
      params: { contractAddress, chainId },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    // Remember last query details for context persistence
    context.state.set('last_queried_tool', 'get_token_metadata');
    context.state.set('last_contract_address', contractAddress);
    context.state.set('last_chain_id', chainId);

    try {
      const alchemy = getAlchemyService();

      // Validate address format
      if (!contractAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
        return {
          success: false,
          error: 'Invalid contract address format',
        };
      }

      // Get token metadata from Alchemy (we need to access the internal method)
      const alchemyInstance = (alchemy as any).getAlchemy(chainId) as Alchemy;
      const metadata = await alchemyInstance.core.getTokenMetadata(contractAddress);

      const result = {
        success: true,
        data: {
          contractAddress,
          chainId,
          name: metadata.name || 'Unknown Token',
          symbol: metadata.symbol || 'UNKNOWN',
          decimals: metadata.decimals || 18,
          logo: metadata.logo,
          totalSupply: metadata.totalSupply,
        },
      };

      // Store result in state before returning
      context.state.set('last_result', result.data);
      context.state.set('last_token_metadata', result.data);

      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch token metadata',
      };
    }
  }
});