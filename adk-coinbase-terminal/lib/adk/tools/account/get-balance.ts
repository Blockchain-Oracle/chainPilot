import { FunctionTool } from '@iqai/adk';
import { getAlchemyService } from '@/lib/services/alchemy';
import { z } from 'zod';

const schema = z.object({
  address: z.string().describe('The wallet address to check balance for (0x...)'),
  chainId: z.number().optional().default(1).describe('The chain ID (1=Ethereum, 8453=Base, 137=Polygon, etc.)'),
});

async function getBalance({
  address,
  chainId = 1,
}: z.infer<typeof schema>) {
  try {
    const alchemy = getAlchemyService();

    // Validate address format
    if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return {
        success: false,
        error: 'Invalid Ethereum address format',
      };
    }

    const balance = await alchemy.getNativeBalance(address, chainId);

    return {
      success: true,
      data: {
        address,
        balance: balance.balance,
        symbol: balance.symbol,
        chain: balance.chainName,
        chainId,
        formatted: `${balance.balance} ${balance.symbol}`,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch balance',
    };
  }
}

export const balanceTool = new FunctionTool(getBalance, {
  name: 'get_balance',
  description: 'Get native token balance (ETH, MATIC, etc.) for a wallet address',
  parameterTypes: schema.shape,
});