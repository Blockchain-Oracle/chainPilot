import { createTool } from '@iqai/adk';
import { getAlchemyService } from '@/lib/services/alchemy';
import { z } from 'zod';

export const tokenBalanceTool = createTool({
  name: 'get_token_balance',
  description: 'Get native and ERC20 token balances for a wallet address on any supported chain',
  schema: z.object({
    address: z.string().describe('The wallet address to check balances for (0x...)'),
    chainId: z.number().optional().default(1).describe('The chain ID (1=Ethereum, 8453=Base, 137=Polygon, etc.)'),
  }),
  fn: async ({ address, chainId = 1 }, context) => {
    // Track query in conversation state
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'get_token_balance',
      params: { address, chainId },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    // Remember last query details for context persistence
    context.state.set('last_queried_tool', 'get_token_balance');
    context.state.set('last_address', address);
    context.state.set('last_chain_id', chainId);

    try {
      console.log('[Tool] get_token_balance called with:', { address, chainId });
      const alchemy = getAlchemyService();

      // Validate address format
      if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
        console.error('[Tool] Invalid address format:', address);
        return {
          success: false,
          error: 'Invalid Ethereum address format',
        };
      }

      // Get native balance
      console.log('[Tool] Fetching native balance...');
      const nativeBalance = await alchemy.getNativeBalance(address, chainId);
      console.log('[Tool] Native balance:', nativeBalance);

      // Get token balances
      console.log('[Tool] Fetching token balances...');
      const tokenBalances = await alchemy.getTokenBalances(address, chainId);
      console.log('[Tool] Token balances count:', tokenBalances.length);

      const result = {
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

      // Store result in state before returning
      context.state.set('last_result', result.data);
      context.state.set('last_token_balances', tokenBalances);

      console.log('[Tool] Returning success result');
      return result;
    } catch (error: any) {
      console.error('[Tool] Error in get_token_balance:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch token balances',
      };
    }
  }
});