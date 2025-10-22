/**
 * Prepare ERC20 Token Approval Tool
 *
 * ADK FunctionTool for preparing ERC20 token approval transactions
 */

import { createTool } from '@iqai/adk';
import { z } from 'zod';
import {
  isAddress,
  validateAmount,
  validateChainId,
  parseTokenAmount,
} from '@/lib/utils/validation';
import { encodeERC20Approve, MAX_UINT256 } from '@/lib/utils/transaction-encoding';
import type { TokenApprovalProps, PrepareTransactionOutput } from '@/lib/types/transactions';
import { getAlchemyService } from '@/lib/services/alchemy';

export const prepareTokenApprovalTool = createTool({
  name: 'prepare_token_approval',
  description: 'Prepare an ERC20 token approval transaction. Allows another address/contract to spend tokens on behalf of the user. Returns transaction details for user approval. Does NOT execute the transaction.',
  schema: z.object({
    from: z.string().describe('The wallet address granting approval'),
    tokenAddress: z.string().describe('The ERC20 token contract address'),
    spender: z.string().describe('The address being approved to spend tokens (e.g., DEX router)'),
    amount: z
      .string()
      .describe(
        'Amount to approve (human-readable) or "unlimited" for maximum approval'
      ),
    chainId: z.number().optional().default(1).describe('Chain ID'),
    spenderName: z
      .string()
      .optional()
      .describe('Name of the spender contract (e.g., "Uniswap V3 Router")'),
  }),
  fn: async ({ from, tokenAddress, spender, amount, chainId, spenderName }, context: any) => {
    // Track query in conversation state
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'prepare_token_approval',
      params: { from, tokenAddress, spender, amount, chainId, spenderName },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    // Remember last query details for context persistence
    context.state.set('last_queried_tool', 'prepare_token_approval');
    context.state.set('last_from', from);
    context.state.set('last_token_address', tokenAddress);
    context.state.set('last_spender', spender);
    context.state.set('last_chain_id', chainId);

    // Validate addresses
    if (!isAddress(from)) {
      return { success: false, error: `Invalid owner address: ${from}` };
    }

    if (!isAddress(tokenAddress)) {
      return { success: false, error: `Invalid token address: ${tokenAddress}` };
    }

    if (!isAddress(spender)) {
      return { success: false, error: `Invalid spender address: ${spender}` };
    }

    // Validate chain
    const chainValidation = validateChainId(chainId);
    if (!chainValidation.valid) {
      return { success: false, error: chainValidation.error };
    }

    // Get token metadata
    const alchemy = getAlchemyService();
    let tokenSymbol = 'TOKEN';
    let tokenDecimals = 18;

    try {
      const alchemyInstance = (alchemy as any).getAlchemy(chainId);
      const metadata = await alchemyInstance.core.getTokenMetadata(tokenAddress);
      if (metadata.symbol) tokenSymbol = metadata.symbol;
      if (metadata.decimals !== null) tokenDecimals = metadata.decimals;
    } catch (error) {
      console.error('Failed to get token metadata:', error);
    }

    // Handle unlimited vs specific amount
    const isUnlimited = amount.toLowerCase() === 'unlimited';
    let amountWei: string;

    if (isUnlimited) {
      amountWei = MAX_UINT256;
    } else {
      // Validate amount
      const amountValidation = validateAmount(amount);
      if (!amountValidation.valid) {
        return { success: false, error: amountValidation.error };
      }

      // Convert to base units
      try {
        amountWei = parseTokenAmount(amount, tokenDecimals);
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to parse amount',
        };
      }
    }

    // Encode approve function call
    let encodedData: string;
    try {
      encodedData = encodeERC20Approve(spender, isUnlimited ? 'unlimited' : amountWei);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to encode approval',
      };
    }

    // Estimate gas
    let gasEstimate = '50000'; // Default for approve
    let gasPrice: string | undefined;

    try {
      const alchemyInstance = (alchemy as any).getAlchemy(chainId);
      const feeData = await alchemyInstance.core.getFeeData();
      if (feeData.gasPrice) {
        gasPrice = feeData.gasPrice.toString();
      }

      const estimatedGas = await alchemyInstance.core.estimateGas({
        from,
        to: tokenAddress,
        data: encodedData,
      });

      gasEstimate = estimatedGas.toString();
    } catch (error) {
      console.error('Failed to estimate gas:', error);
    }

    // Return transaction data
    const result = {
      success: true,
      transaction: {
        type: 'token_approval',
        from,
        tokenAddress,
        tokenSymbol,
        tokenDecimals,
        spender,
        spenderName,
        amount: isUnlimited ? 'Unlimited' : amount,
        amountWei,
        data: encodedData,
        chainId,
        gasEstimate,
        gasPrice,
        isUnlimited,
      },
    };

    // Store result in state before returning
    context.state.set('last_result', result.transaction);
    context.state.set('last_prepared_transaction', result.transaction);

    return result;
  }
});
