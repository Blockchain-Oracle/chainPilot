import { createTool } from '@iqai/adk';
import { getAlchemyService } from '@/lib/services/alchemy';
import { z } from 'zod';

export const tokenPriceTool = createTool({
  name: 'get_token_price',
  description: 'Get current USD price and 24h change for a token',
  schema: z.object({
    symbol: z.string().describe('The token symbol (ETH, USDC, etc.)'),
    chainId: z.number().optional().default(1).describe('The chain ID for context'),
  }),
  fn: async ({ symbol, chainId = 1 }, context) => {
    // Track query in conversation state
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'get_token_price',
      params: { symbol, chainId },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    // Remember last query details for context persistence
    context.state.set('last_queried_tool', 'get_token_price');
    context.state.set('last_token_symbol', symbol);
    context.state.set('last_chain_id', chainId);

    try {
      const alchemy = getAlchemyService();
      const priceData = await alchemy.getTokenPrice(symbol, chainId);

      const result = {
        success: true,
        data: {
          symbol: symbol.toUpperCase(),
          price: priceData.usd,
          change24h: priceData.change24h,
          formattedPrice: `$${priceData.usd.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
          })}`,
          priceChange: priceData.change24h > 0 ? 'up' : priceData.change24h < 0 ? 'down' : 'stable',
        },
      };

      // Store result in state before returning
      context.state.set('last_result', result.data);
      context.state.set('last_token_price', result.data);

      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch token price',
      };
    }
  }
});