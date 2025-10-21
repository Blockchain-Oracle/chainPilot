import { FunctionTool } from '@iqai/adk';
import { getAlchemyService, CHAIN_NAMES } from '@/lib/services/alchemy';
import { z } from 'zod';

const schema = z.object({
  chainId: z.number().optional().default(1).describe('The chain ID (1=Ethereum, 8453=Base, 137=Polygon, etc.)'),
});

async function getGasPrice({
  chainId = 1,
}: z.infer<typeof schema>) {
  try {
    const alchemy = getAlchemyService();
    const gasPrice = await alchemy.getGasPrice(chainId);
    const chainName = CHAIN_NAMES[chainId] || 'Unknown Chain';

    return {
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
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch gas prices',
    };
  }
}

export const gasPriceTool = new FunctionTool(getGasPrice, {
  name: 'get_gas_price',
  description: 'Get current gas prices (slow, standard, fast) for a blockchain',
});