/**
 * Prepare ETH Transfer Tool
 *
 * ADK FunctionTool for preparing native ETH transfer transactions
 */

import { createTool } from '@iqai/adk';
import { z } from 'zod';
import {
  isAddress,
  validateAmount,
  validateChainId,
  parseEthToWei,
} from '@/lib/utils/validation';
import type { EthTransferProps, PrepareTransactionOutput } from '@/lib/types/transactions';
import { getAlchemyService } from '@/lib/services/alchemy';

export const prepareEthTransferTool = createTool({
  name: 'prepare_eth_transfer',
  description: 'Prepare a native ETH transfer transaction. Returns transaction details for user approval. Does NOT execute the transaction.',
  schema: z.object({
    from: z
      .string()
      .describe('The sender wallet address (must be connected wallet)'),
    to: z.string().describe('The recipient wallet address'),
    amount: z
      .string()
      .describe('Amount of ETH to send (human-readable, e.g., "0.1", "2.5")'),
    chainId: z
      .number()
      .optional()
      .default(1)
      .describe('Chain ID (1=Ethereum, 8453=Base, 42161=Arbitrum, etc.)'),
    toEnsName: z.string().optional().describe('ENS name of recipient (if available)'),
  }),
  fn: async ({ from, to, amount, chainId, toEnsName }, context: any) => {
    // Validate sender address
    if (!isAddress(from)) {
      return {
        success: false,
        error: `Invalid sender address: ${from}`,
      };
    }

    // Validate recipient address
    if (!isAddress(to)) {
      return {
        success: false,
        error: `Invalid recipient address: ${to}`,
      };
    }

    // Validate amount
    const amountValidation = validateAmount(amount);
    if (!amountValidation.valid) {
      return {
        success: false,
        error: amountValidation.error,
      };
    }

    // Validate chain ID
    const chainValidation = validateChainId(chainId);
    if (!chainValidation.valid) {
      return {
        success: false,
        error: chainValidation.error,
      };
    }

    // Convert amount to wei
    let valueInWei: string;
    try {
      valueInWei = parseEthToWei(amount);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to parse amount',
      };
    }

    // Get Alchemy service for gas estimation
    const alchemy = getAlchemyService();

    // Estimate gas (simple transfer is typically 21,000)
    let gasEstimate = '21000'; // Default for simple transfers
    let gasPrice: string | undefined;

    try {
      // Get current gas price
      const feeData = await alchemy.core.getFeeData();
      if (feeData.gasPrice) {
        gasPrice = feeData.gasPrice.toString();
      }

      // For simple ETH transfers, gas is fixed at 21,000
      // No need to estimate
    } catch (error) {
      console.error('Failed to get gas data:', error);
      // Continue with defaults
    }

    // Return transaction data
    return {
      success: true,
      transaction: {
        type: 'eth_transfer',
        from,
        to,
        amount,
        value: valueInWei,
        chainId,
        gasEstimate,
        gasPrice,
        toEnsName,
      },
    };
  }
});
