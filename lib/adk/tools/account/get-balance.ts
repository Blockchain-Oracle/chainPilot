import { createTool } from '@iqai/adk';
import { getAlchemyService } from '@/lib/services/alchemy';
import { z } from 'zod';

export const balanceTool = createTool({
  name: 'get_balance',
  description: 'Get native token balance (ETH, MATIC, etc.) for a wallet address',
  schema: z.object({
    address: z.string().describe('The wallet address to check balance for (0x...)'),
    chainId: z.number().optional().default(1).describe('The chain ID (1=Ethereum, 8453=Base, 137=Polygon, etc.)'),
  }),
  fn: async ({ address, chainId = 1 }, context) => {
    try {
      // Track query in conversation state
      const queryHistory = context.state.get('query_history', []);
      queryHistory.push({
        tool: 'get_balance',
        address,
        chainId,
        timestamp: new Date().toISOString(),
      });
      context.state.set('query_history', queryHistory);

      // Remember the last queried chain for context
      context.state.set('last_chain_id', chainId);
      context.state.set('last_address', address);

      const alchemy = getAlchemyService();

      // Validate address format
      if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
        return {
          success: false,
          error: 'Invalid Ethereum address format',
        };
      }

      const balance = await alchemy.getNativeBalance(address, chainId);

      const result = {
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

      // Cache the result in state for quick reference
      context.state.set('last_balance_result', result.data);

      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch balance',
      };
    }
  }
});