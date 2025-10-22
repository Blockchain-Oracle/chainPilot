/**
 * Prepare ERC20 Token Transfer Tool
 *
 * ADK FunctionTool for preparing ERC20 token transfer transactions
 */

import { createTool } from '@iqai/adk';
import { z } from 'zod';
import {
  isAddress,
  validateAmount,
  validateChainId,
  parseTokenAmount,
} from '@/lib/utils/validation';
import { encodeERC20Transfer } from '@/lib/utils/transaction-encoding';
import type { TokenTransferProps, PrepareTransactionOutput } from '@/lib/types/transactions';
import { getAlchemyService } from '@/lib/services/alchemy';

export const prepareTokenTransferTool = createTool({
  name: 'prepare_token_transfer',
  description: 'Prepare an ERC20 token transfer transaction. Returns transaction details for user approval. Does NOT execute the transaction.',
  schema: z.object({
    from: z.string().describe('The sender wallet address'),
    tokenAddress: z.string().describe('The ERC20 token contract address'),
    to: z.string().describe('The recipient wallet address'),
    amount: z
      .string()
      .describe('Amount of tokens to send (human-readable, e.g., "100", "0.5")'),
    chainId: z
      .number()
      .optional()
      .default(1)
      .describe('Chain ID'),
    toEnsName: z.string().optional().describe('ENS name of recipient'),
  }),
  fn: async ({ from, tokenAddress, to, amount, chainId, toEnsName }, context: any) => {
    // Track query in conversation state
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'prepare_token_transfer',
      params: { from, tokenAddress, to, amount, chainId, toEnsName },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    // Remember last query details for context persistence
    context.state.set('last_queried_tool', 'prepare_token_transfer');
    context.state.set('last_from', from);
    context.state.set('last_token_address', tokenAddress);
    context.state.set('last_to', to);
    context.state.set('last_chain_id', chainId);

    // Validate addresses
    if (!isAddress(from)) {
      return { success: false, error: `Invalid sender address: ${from}` };
    }

    if (!isAddress(to)) {
      return { success: false, error: `Invalid recipient address: ${to}` };
    }

    if (!isAddress(tokenAddress)) {
      return { success: false, error: `Invalid token contract address: ${tokenAddress}` };
    }

    // Validate amount
    const amountValidation = validateAmount(amount);
    if (!amountValidation.valid) {
      return { success: false, error: amountValidation.error };
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
      const metadata = await alchemy.core.getTokenMetadata(tokenAddress);
      if (metadata.symbol) tokenSymbol = metadata.symbol;
      if (metadata.decimals !== null) tokenDecimals = metadata.decimals;
    } catch (error) {
      console.error('Failed to get token metadata:', error);
      // Continue with defaults
    }

    // Convert amount to base units
    let amountWei: string;
    try {
      amountWei = parseTokenAmount(amount, tokenDecimals);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to parse token amount',
      };
    }

    // Encode transfer function call
    let encodedData: string;
    try {
      encodedData = encodeERC20Transfer(to, amountWei);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to encode transfer',
      };
    }

    // Estimate gas
    let gasEstimate = '65000'; // Default estimate for ERC20 transfer
    let gasPrice: string | undefined;

    try {
      const feeData = await alchemy.core.getFeeData();
      if (feeData.gasPrice) {
        gasPrice = feeData.gasPrice.toString();
      }

      // Estimate gas for the actual call
      const estimatedGas = await alchemy.core.estimateGas({
        from,
        to: tokenAddress,
        data: encodedData,
      });

      gasEstimate = estimatedGas.toString();
    } catch (error) {
      console.error('Failed to estimate gas:', error);
      // Continue with default
    }

    // Return transaction data
    const result = {
      success: true,
      transaction: {
        type: 'token_transfer',
        from,
        tokenAddress,
        tokenSymbol,
        tokenDecimals,
        to,
        amount,
        amountWei,
        data: encodedData,
        chainId,
        gasEstimate,
        gasPrice,
        toEnsName,
      },
    };

    // Store result in state before returning
    context.state.set('last_result', result.transaction);
    context.state.set('last_prepared_transaction', result.transaction);

    return result;
  }
});
