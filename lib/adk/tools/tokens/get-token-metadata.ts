import { FunctionTool } from '@iqai/adk';
import { getAlchemyService } from '@/lib/services/alchemy';
import { z } from 'zod';
import { Alchemy } from 'alchemy-sdk';

const schema = z.object({
  contractAddress: z.string().describe('The token contract address (0x...)'),
  chainId: z.number().optional().default(1).describe('The chain ID (1=Ethereum, 8453=Base, 137=Polygon, etc.)'),
});

async function getTokenMetadata({
  contractAddress,
  chainId = 1,
}: z.infer<typeof schema>) {
  try {
    const alchemy = getAlchemyService();

    // Validate address format
    if (!contractAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      return {
        success: false,
        error: 'Invalid contract address format',
      };
    }

    // Get token metadata from Alchemy (we need to access the internal method)
    const alchemyInstance = (alchemy as any).getAlchemy(chainId) as Alchemy;
    const metadata = await alchemyInstance.core.getTokenMetadata(contractAddress);

    return {
      success: true,
      data: {
        contractAddress,
        chainId,
        name: metadata.name || 'Unknown Token',
        symbol: metadata.symbol || 'UNKNOWN',
        decimals: metadata.decimals || 18,
        logo: metadata.logo,
        totalSupply: metadata.totalSupply,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch token metadata',
    };
  }
}

export const tokenMetadataTool = new FunctionTool(getTokenMetadata, {
  name: 'get_token_metadata',
  description: 'Get metadata for an ERC20 token including name, symbol, decimals, and logo',
  parameterTypes: schema.shape,
});