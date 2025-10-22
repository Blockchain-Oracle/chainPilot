import { createTool } from '@iqai/adk';
import { getJupiterService } from '../jupiter-service';
import { z } from 'zod';
import type { TokenSearchResponse } from '@/lib/ai/tools/jupiter/types';

export const jupiterSearchTokensTool = createTool({
  name: 'jupiter_search_tokens',
  description: 'Search for Solana tokens by symbol, name, or mint address. Returns comprehensive token data including price, volume, holders, liquidity, safety metrics, and trading stats.',
  schema: z.object({
    query: z.string().describe('Search query - can be token symbol (e.g., "SOL"), name (e.g., "Solana"), or mint address. Supports comma-separated values for multiple tokens (max 100).'),
  }),
  fn: async ({ query }, context) => {
    // Track query in conversation state
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'jupiter_search_tokens',
      params: { query },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    // Remember last query details
    context.state.set('last_queried_tool', 'jupiter_search_tokens');
    context.state.set('last_search_query', query);

    try {
      const jupiter = getJupiterService();

      const results = await jupiter.searchTokens(query) as TokenSearchResponse;

      const result = {
        success: true,
        data: results,
        metadata: {
          count: results.length,
          query,
          tierInfo: jupiter.getTierInfo(),
        },
      };

      // Store result in state
      context.state.set('last_result', result.data);
      context.state.set('last_token_search', result.data);

      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to search tokens',
      };
    }
  }
});
