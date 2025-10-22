import { createTool } from '@iqai/adk';
import { getJupiterService } from '../jupiter-service';
import { z } from 'zod';
import type { OrderResponse } from '@/lib/ai/tools/jupiter/types';

export const jupiterGetSwapQuoteTool = createTool({
  name: 'jupiter_get_swap_quote',
  description: 'Get a swap quote for exchanging tokens on Solana. Returns route information, price impact, fees, and optionally an unsigned transaction ready to sign. Supports multiple routers and advanced features like gasless swaps and integrator fees.',
  schema: z.object({
    inputMint: z.string().describe('Input token mint address'),
    outputMint: z.string().describe('Output token mint address'),
    amount: z.string().describe('Amount in smallest unit (considering token decimals). For example, for 1 SOL with 9 decimals, use "1000000000"'),
    taker: z.string().optional().describe('Taker wallet address. If provided, returns a transaction ready to sign. If omitted, returns quote only.'),
    referralAccount: z.string().optional().describe('Referral account address for integrator fees'),
    referralFee: z.number().optional().describe('Referral fee in basis points (50-255)'),
    excludeRouters: z.array(z.enum(['metis', 'jupiterz', 'dflow', 'okx'])).optional().describe('Routers to exclude from quote'),
    excludeDexes: z.string().optional().describe('Comma-separated DEX names to exclude (e.g., "Raydium,Orca V2"). Only applies to Metis router.'),
    payer: z.string().optional().describe('External gas payer address for gasless transactions'),
  }),
  fn: async ({ inputMint, outputMint, amount, taker, referralAccount, referralFee, excludeRouters, excludeDexes, payer }, context) => {
    // Track query in conversation state
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'jupiter_get_swap_quote',
      params: { inputMint, outputMint, amount, taker },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    // Remember last query details
    context.state.set('last_queried_tool', 'jupiter_get_swap_quote');
    context.state.set('last_swap_params', { inputMint, outputMint, amount });

    try {
      const jupiter = getJupiterService();

      const quote = await jupiter.getOrder({
        inputMint,
        outputMint,
        amount,
        taker,
        referralAccount,
        referralFee,
        excludeRouters,
        excludeDexes,
        payer,
      }) as OrderResponse;

      const result = {
        success: true,
        data: quote,
        metadata: {
          hasTransaction: Boolean(quote.transaction),
          isGasless: quote.gasless,
          router: quote.router,
          tierInfo: jupiter.getTierInfo(),
        },
      };

      // Store result in state
      context.state.set('last_result', result.data);
      context.state.set('last_swap_quote', result.data);

      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get swap quote',
      };
    }
  }
});
