import { FunctionTool } from '@iqai/adk';
import { getAlchemyService } from '@/lib/services/alchemy';
import { z } from 'zod';

const schema = z.object({
  address: z.string().describe('The wallet address to check balances for (0x...)'),
  chainId: z.number().optional().default(1).describe('The chain ID (1=Ethereum, 8453=Base, 137=Polygon, etc.)'),
});

async function getTokenBalance({
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

    // Get native balance
    const nativeBalance = await alchemy.getNativeBalance(address, chainId);

    // Get token balances
    const tokenBalances = await alchemy.getTokenBalances(address, chainId);

    return {
      success: true,
      data: {
        address,
        chain: nativeBalance.chainName,
        chainId,
        native: {
          symbol: nativeBalance.symbol,
          balance: nativeBalance.balance,
        },
        tokens: tokenBalances,
        totalTokens: tokenBalances.length,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch token balances',
    };
  }
}

export const tokenBalanceTool = new FunctionTool(getTokenBalance, {
  name: 'get_token_balance',
  description: 'Get native and ERC20 token balances for a wallet address on any supported chain',
});