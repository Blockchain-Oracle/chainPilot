/**
 * Prepare Generic Contract Call Tool
 *
 * ADK FunctionTool for preparing generic smart contract interactions
 */

import { createTool } from '@iqai/adk';
import { z } from 'zod';
import {
  isAddress,
  validateChainId,
  parseEthToWei,
} from '@/lib/utils/validation';
import type { ContractCallProps, PrepareTransactionOutput } from '@/lib/types/transactions';
import { getAlchemyService } from '@/lib/services/alchemy';

export const prepareContractCallTool = createTool({
  name: 'prepare_contract_call',
  description: 'Prepare a generic smart contract function call. Requires pre-encoded function data. Returns transaction details for user approval. Does NOT execute the transaction.',
  schema: z.object({
    from: z.string().describe('The wallet address making the call'),
    contractAddress: z.string().describe('The smart contract address to interact with'),
    functionName: z.string().describe('The contract function name to call'),
    data: z
      .string()
      .describe('Pre-encoded function call data (hex string starting with 0x)'),
    value: z
      .string()
      .optional()
      .default('0')
      .describe('ETH value to send with the call (for payable functions), e.g., "0.1"'),
    chainId: z.number().optional().default(1).describe('Chain ID'),
    contractName: z
      .string()
      .optional()
      .describe('Human-readable contract name'),
    comment: z.string().optional().describe('Additional context about this call'),
  }),
  fn: async ({ from, contractAddress, functionName, data, value, chainId, contractName, comment }, context: any) => {
    // Track query in conversation state
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'prepare_contract_call',
      params: { from, contractAddress, functionName, data, value, chainId, contractName, comment },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    // Remember last query details for context persistence
    context.state.set('last_queried_tool', 'prepare_contract_call');
    context.state.set('last_from', from);
    context.state.set('last_contract_address', contractAddress);
    context.state.set('last_chain_id', chainId);

    // Validate addresses
    if (!isAddress(from)) {
      return { success: false, error: `Invalid sender address: ${from}` };
    }

    if (!isAddress(contractAddress)) {
      return { success: false, error: `Invalid contract address: ${contractAddress}` };
    }

    // Validate chain
    const chainValidation = validateChainId(chainId);
    if (!chainValidation.valid) {
      return { success: false, error: chainValidation.error };
    }

    // Validate data is hex
    if (!data.startsWith('0x') || !/^0x[0-9a-fA-F]*$/.test(data)) {
      return {
        success: false,
        error: 'Invalid function data: must be hex string starting with 0x',
      };
    }

    // Minimum data length: function selector (4 bytes = 8 hex chars + 0x)
    if (data.length < 10) {
      return {
        success: false,
        error: 'Invalid function data: too short (must include function selector)',
      };
    }

    // Convert value to wei if provided
    let valueWei: string | undefined;
    if (value && value !== '0') {
      try {
        valueWei = parseEthToWei(value);
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to parse value',
        };
      }
    }

    // Estimate gas
    const alchemy = getAlchemyService();
    let gasEstimate = '100000'; // Default for contract interactions
    let gasPrice: string | undefined;

    try {
      const feeData = await alchemy.core.getFeeData();
      if (feeData.gasPrice) {
        gasPrice = feeData.gasPrice.toString();
      }

      const estimatedGas = await alchemy.core.estimateGas({
        from,
        to: contractAddress,
        data,
        value: valueWei ? BigInt(valueWei) : undefined,
      });

      gasEstimate = estimatedGas.toString();
    } catch (error) {
      console.error('Failed to estimate gas:', error);
      // Gas estimation failure might indicate the transaction will revert
      // Return error to user
      return {
        success: false,
        error: 'Gas estimation failed. Transaction may revert. Please check contract state and parameters.',
      };
    }

    // Return transaction data
    const result = {
      success: true,
      transaction: {
        type: 'contract_call',
        from,
        contractAddress,
        contractName,
        functionName,
        data,
        value: valueWei,
        chainId,
        gasEstimate,
        gasPrice,
        comment,
      },
    };

    // Store result in state before returning
    context.state.set('last_result', result.transaction);
    context.state.set('last_prepared_transaction', result.transaction);

    return result;
  }
});
