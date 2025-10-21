import { FunctionTool } from '@iqai/adk';
import { getAlchemyService } from '@/lib/services/alchemy';
import { z } from 'zod';

const schema = z.object({
  address: z.string().describe('The wallet address to check NFTs for (0x...)'),
  chainId: z.number().optional().default(1).describe('The chain ID (1=Ethereum, 8453=Base, 137=Polygon, etc.)'),
});

async function getNFTsOwned({
  address,
  chainId = 1,
}: z.infer<typeof schema>) {
  try {
    const alchemy = getAlchemyService();

    // Validate address format
    if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return {
        success: false,
        error: 'Invalid Ethereum address format',
      };
    }

    const nfts = await alchemy.getNFTsOwned(address, chainId);

    // Group NFTs by collection
    const collections = nfts.reduce((acc, nft) => {
      if (!acc[nft.collection]) {
        acc[nft.collection] = {
          name: nft.collection,
          contract: nft.contract,
          tokenType: nft.tokenType,
          nfts: [],
        };
      }
      acc[nft.collection].nfts.push(nft);
      return acc;
    }, {} as Record<string, any>);

    return {
      success: true,
      data: {
        address,
        chainId,
        totalNFTs: nfts.length,
        collections: Object.values(collections),
        nfts,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch NFTs',
    };
  }
}

export const nftsOwnedTool = new FunctionTool(getNFTsOwned, {
  name: 'get_nfts_owned',
  description: 'Get all NFTs owned by a wallet address on any supported chain',
  parameterTypes: schema.shape,
});