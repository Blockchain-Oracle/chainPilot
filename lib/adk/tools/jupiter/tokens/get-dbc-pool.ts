import { createTool } from '@iqai/adk';
import { getJupiterService } from '../jupiter-service';
import { z } from 'zod';
import type { DBCPoolAddressesResponse } from '@/lib/ai/tools/jupiter/types';

export const jupiterGetDBCPoolTool = createTool({
  name: 'jupiter_get_dbc_pool',
  description: 'Get DBC (Dynamic Bonding Curve) pool addresses for a token mint. Returns DAMM v2 pool address, DBC pool address, and config key.',
  schema: z.object({
    mint: z.string().describe('Token mint address to get pool addresses for'),
  }),
  fn: async ({ mint }, context) => {
    // Track query in conversation state
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'jupiter_get_dbc_pool',
      params: { mint },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    // Remember last query details
    context.state.set('last_queried_tool', 'jupiter_get_dbc_pool');
    context.state.set('last_dbc_mint', mint);

    try {
      const jupiter = getJupiterService();

      const poolData = await jupiter.getDBCPoolAddresses(mint) as DBCPoolAddressesResponse;

      const result = {
        success: poolData.success,
        data: poolData.data,
        metadata: {
          mint,
          tierInfo: jupiter.getTierInfo(),
        },
      };

      // Store result in state
      context.state.set('last_result', result.data);
      context.state.set('last_dbc_pool', result.data);

      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get DBC pool addresses',
      };
    }
  }
});
