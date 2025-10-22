import { createTool } from '@iqai/adk';
import { z } from 'zod';

/**
 * Jupiter Show Plugin Tool
 *
 * Shows the full Jupiter swap interface inline in chat
 * Users can swap any tokens with full Jupiter functionality
 */
export const jupiterShowPluginTool = createTool({
  name: 'jupiter_show_plugin',
  description: 'Show the Jupiter swap interface inline in chat. Use this when user wants to access the full swap interface, swap any tokens, or needs the Jupiter plugin.',

  schema: z.object({
    initialInputMint: z.string().optional().describe('Optional: Pre-select input token by mint address'),
    initialOutputMint: z.string().optional().describe('Optional: Pre-select output token by mint address'),
    initialAmount: z.string().optional().describe('Optional: Pre-fill swap amount'),
  }),

  fn: async ({ initialInputMint, initialOutputMint, initialAmount }, context) => {
    // Track query in history
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'jupiter_show_plugin',
      params: { initialInputMint, initialOutputMint, initialAmount },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    // Set last queried tool
    context.state.set('last_queried_tool', 'jupiter_show_plugin');

    // Set specific params
    context.state.set('last_plugin_params', {
      initialInputMint,
      initialOutputMint,
      initialAmount,
    });

    console.log('[jupiter_show_plugin] Showing Jupiter plugin interface', {
      initialInputMint,
      initialOutputMint,
      initialAmount,
    });

    // Return success with optional pre-fill data
    const result = {
      success: true,
      data: {
        mode: 'integrated',
        formProps: {
          initialInputMint,
          initialOutputMint,
          initialAmount,
        },
      },
      metadata: {
        displayInline: true,
        componentType: 'jupiter_plugin',
      },
    };

    // Store result
    context.state.set('last_result', result.data);
    context.state.set('last_plugin_display', result.data);

    return result;
  },
});
