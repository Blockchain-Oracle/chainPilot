import { createTool } from '@iqai/adk';
import { getJupiterService } from '../jupiter-service';
import { z } from 'zod';
import type { RoutersResponse } from '@/lib/ai/tools/jupiter/types';

export const jupiterGetRoutersTool = createTool({
  name: 'jupiter_get_routers',
  description: 'Get list of available swap routers on Jupiter including Metis, JupiterZ, DFlow, and OKX DEX Router.',
  schema: z.object({}),
  fn: async ({}, context) => {
    // Track query in conversation state
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'jupiter_get_routers',
      params: {},
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    // Remember last query details
    context.state.set('last_queried_tool', 'jupiter_get_routers');

    try {
      const jupiter = getJupiterService();

      const routers = await jupiter.getRouters() as RoutersResponse;

      const result = {
        success: true,
        data: routers,
        metadata: {
          count: routers.length,
          tierInfo: jupiter.getTierInfo(),
        },
      };

      // Store result in state
      context.state.set('last_result', result.data);
      context.state.set('last_routers', result.data);

      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get routers',
      };
    }
  }
});
