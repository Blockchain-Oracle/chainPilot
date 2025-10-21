import { FunctionTool } from '@iqai/adk';
import { getAlchemyService } from '@/lib/services/alchemy';
import { z } from 'zod';

const schema = z.object({
  address: z.string().describe('The wallet address to get transaction history for (0x...)'),
  chainId: z.number().optional().default(1).describe('The chain ID (1=Ethereum, 8453=Base, 137=Polygon, etc.)'),
  limit: z.number().optional().default(10).describe('Number of transactions to return'),
});

async function getTransactionHistory({
  address,
  chainId = 1,
  limit = 10,
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

    const transactions = await alchemy.getTransactionHistory(address, chainId, limit);

    // Add explorer links
    const transactionsWithLinks = transactions.map(tx => ({
      ...tx,
      explorerUrl: alchemy.getExplorerUrl(tx.hash, chainId),
    }));

    return {
      success: true,
      data: {
        address,
        chainId,
        count: transactionsWithLinks.length,
        transactions: transactionsWithLinks,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch transaction history',
    };
  }
}

export const transactionHistoryTool = new FunctionTool(getTransactionHistory, {
  name: 'get_transaction_history',
  description: 'Get recent transaction history for a wallet address',
  parameterTypes: schema.shape,
});