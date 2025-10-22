import { createTool } from '@iqai/adk';
import { getAlchemyService } from '@/lib/services/alchemy';
import { z } from 'zod';

export const ensResolverTool = createTool({
  name: 'resolve_ens',
  description: 'Resolve ENS name to address or lookup ENS name for an address',
  schema: z.object({
    input: z.string().describe('ENS name (vitalik.eth) or address (0x...) to resolve'),
  }),
  fn: async ({ input }, context) => {
    // Track query in conversation state
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'resolve_ens',
      params: { input },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    // Remember last query details for context persistence
    context.state.set('last_queried_tool', 'resolve_ens');
    context.state.set('last_ens_input', input);

    try {
      const alchemy = getAlchemyService();
      let result;

      // Check if input is an address or ENS name
      if (input.match(/^0x[a-fA-F0-9]{40}$/)) {
        // It's an address, lookup ENS name
        const ensName = await alchemy.lookupENS(input);
        result = {
          type: 'reverse',
          address: input,
          ensName: ensName || 'No ENS name found',
          hasEns: !!ensName,
        };
      } else if (input.endsWith('.eth')) {
        // It's an ENS name, resolve to address
        const address = await alchemy.resolveENS(input);
        result = {
          type: 'forward',
          ensName: input,
          address: address || 'ENS name not found',
          resolved: !!address,
        };
      } else {
        return {
          success: false,
          error: 'Invalid input. Provide either an ENS name (*.eth) or Ethereum address (0x...)',
        };
      }

      const response = {
        success: true,
        data: result,
      };

      // Store result in state before returning
      context.state.set('last_result', result);
      context.state.set('last_ens_resolution', result);

      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to resolve ENS',
      };
    }
  }
});