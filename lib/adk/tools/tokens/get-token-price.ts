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
    try {
      const alchemy = getAlchemyService();
      const priceData = await alchemy.getTokenPrice(symbol, chainId);

      return {
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
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch token price',
      };
    }
  }
});