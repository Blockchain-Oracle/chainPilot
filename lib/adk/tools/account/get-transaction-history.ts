import { createTool } from '@iqai/adk';
import { getAlchemyService } from '@/lib/services/alchemy';
import { z } from 'zod';

export const transactionHistoryTool = createTool({
  name: 'get_transaction_history',
  description: 'Get recent transaction history for a wallet address',
  schema: z.object({
    address: z.string().describe('The wallet address to get transaction history for (0x...)'),
    chainId: z.number().optional().default(1).describe('The chain ID (1=Ethereum, 8453=Base, 137=Polygon, etc.)'),
    limit: z.number().optional().default(10).describe('Number of transactions to return'),
  }),
  fn: async ({ address, chainId = 1, limit = 10 }, context) => {
    // Track query in conversation state
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'get_transaction_history',
      params: { address, chainId, limit },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    // Remember last query details for context persistence
    context.state.set('last_queried_tool', 'get_transaction_history');
    context.state.set('last_address', address);
    context.state.set('last_chain_id', chainId);

    try {
      const alchemy = getAlchemyService();

      // Validate address format
      if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
        return {
          success: false,
          error: 'Invalid Ethereum address format',
        };
      }

      const transactions = await alchemy.getTransactionHistory(address, chainId, limit);

      // Add explorer links
      const transactionsWithLinks = transactions.map(tx => ({
        ...tx,
        explorerUrl: alchemy.getExplorerUrl(tx.hash, chainId),
      }));

      const result = {
        success: true,
        data: {
          address,
          chainId,
          count: transactionsWithLinks.length,
          transactions: transactionsWithLinks,
        },
      };

      // Store result in state before returning
      context.state.set('last_result', result.data);
      context.state.set('last_transactions', transactionsWithLinks);

      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch transaction history',
      };
    }
  }
});