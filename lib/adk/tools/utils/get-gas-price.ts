import { createTool } from '@iqai/adk';
import { getAlchemyService, CHAIN_NAMES } from '@/lib/services/alchemy';
import { z } from 'zod';

export const gasPriceTool = createTool({
  name: 'get_gas_price',
  description: 'Get current gas prices (slow, standard, fast) for a blockchain',
  schema: z.object({
    chainId: z.number().optional().default(1).describe('The chain ID (1=Ethereum, 8453=Base, 137=Polygon, etc.)'),
  }),
  fn: async ({ chainId = 1 }, context) => {
    // Track query in conversation state
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'get_gas_price',
      params: { chainId },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    // Remember last query details for context persistence
    context.state.set('last_queried_tool', 'get_gas_price');
    context.state.set('last_chain_id', chainId);

    try {
      const alchemy = getAlchemyService();
      const gasPrice = await alchemy.getGasPrice(chainId);
      const chainName = CHAIN_NAMES[chainId] || 'Unknown Chain';

      const result = {
        success: true,
        data: {
          chainId,
          chain: chainName,
          prices: {
            slow: {
              gwei: gasPrice.slow,
              description: 'Slower confirmation (10+ minutes)',
            },
            standard: {
              gwei: gasPrice.standard,
              description: 'Standard speed (3-5 minutes)',
            },
            fast: {
              gwei: gasPrice.fast,
              description: 'Fast confirmation (15-30 seconds)',
            },
          },
          recommendation: 'Use standard gas for most transactions, fast for time-sensitive operations',
        },
      };

      // Store result in state before returning
      context.state.set('last_result', result.data);
      context.state.set('last_gas_price', result.data);

      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch gas prices',
      };
    }
  }
});