import { createTool } from '@iqai/adk';
import { getAlchemyService, CHAIN_NAMES } from '@/lib/services/alchemy';
import { z } from 'zod';

export const estimateGasTool = createTool({
  name: 'estimate_gas',
  description: 'Estimate gas cost for a transaction before sending it',
  schema: z.object({
    from: z.string().describe('The sender address (0x...)'),
    to: z.string().describe('The recipient address (0x...)'),
    value: z.string().describe('The amount to send in ETH/native token'),
    data: z.string().optional().describe('Optional transaction data for smart contract calls'),
    chainId: z.number().optional().default(1).describe('The chain ID (1=Ethereum, 8453=Base, 137=Polygon, etc.)'),
  }),
  fn: async ({ from, to, value, data, chainId = 1 }, context: any) => {
    // Track query in conversation state
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'estimate_gas',
      params: { from, to, value, data, chainId },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    // Remember last query details for context persistence
    context.state.set('last_queried_tool', 'estimate_gas');
    context.state.set('last_from', from);
    context.state.set('last_to', to);
    context.state.set('last_chain_id', chainId);

    try {
      const alchemy = getAlchemyService();

      // Validate addresses
      if (!from.match(/^0x[a-fA-F0-9]{40}$/)) {
        return {
          success: false,
          error: 'Invalid sender address format',
        };
      }

      if (!to.match(/^0x[a-fA-F0-9]{40}$/)) {
        return {
          success: false,
          error: 'Invalid recipient address format',
        };
      }

      // Validate value is a valid number
      const valueNum = parseFloat(value);
      if (isNaN(valueNum) || valueNum < 0) {
        return {
          success: false,
          error: 'Invalid value. Must be a positive number.',
        };
      }

      const estimate = await alchemy.estimateGas(from, to, value, data, chainId);
      const chainName = CHAIN_NAMES[chainId] || 'Unknown Chain';

      const result = {
        success: true,
        data: {
          from,
          to,
          value: `${value} ${alchemy['getNativeTokenSymbol'](chainId)}`,
          chainId,
          chain: chainName,
          gasLimit: estimate.gasLimit,
          gasPrice: `${estimate.gasPrice} Gwei`,
          estimatedCost: `${estimate.estimatedCost} ${alchemy['getNativeTokenSymbol'](chainId)}`,
          summary: `Transaction will cost approximately ${estimate.estimatedCost} ${alchemy['getNativeTokenSymbol'](chainId)} in gas fees`,
        },
      };

      // Store result in state before returning
      context.state.set('last_result', result.data);
      context.state.set('last_gas_estimate', estimate);

      return result;
    } catch (error: any) {
      // Check for common errors
      if (error.message?.includes('insufficient funds')) {
        return {
          success: false,
          error: 'Insufficient funds for transaction',
        };
      }

      return {
        success: false,
        error: error.message || 'Failed to estimate gas',
      };
    }
  }
});