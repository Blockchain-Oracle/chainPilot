import { FunctionTool } from '@iqai/adk';
import { getAlchemyService } from '@/lib/services/alchemy';
import { z } from 'zod';

const schema = z.object({
  input: z.string().describe('ENS name (vitalik.eth) or address (0x...) to resolve'),
});

async function resolveENS({
  input,
}: z.infer<typeof schema>) {
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

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to resolve ENS',
    };
  }
}

export const ensResolverTool = new FunctionTool(resolveENS, {
  name: 'resolve_ens',
  description: 'Resolve ENS name to address or lookup ENS name for an address',
});