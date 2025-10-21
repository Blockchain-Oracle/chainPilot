/**
 * Get Contract Metadata Tool
 *
 * ADK FunctionTool for getting collection-level metadata
 * Includes OpenSea data, total supply, deployer info
 */

/**
 * Get Contract Metadata Tool
 *
 * ADK FunctionTool for getting collection-level metadata
 * Includes OpenSea data, total supply, deployer info
 */

import { createTool } from '@iqai/adk';
import { z } from 'zod';

export const getContractMetadataTool = createTool({
  name: 'get_contract_metadata',
  description: 'Get collection-level metadata including OpenSea data, total supply, and deployer information',
  schema: z.object({
    contractAddress: z.string().describe('The NFT contract address (0x...)'),
    chainId: z.number().optional().default(1).describe('The chain ID (1=Ethereum, 8453=Base, etc.)'),
  }),
  fn: async ({ contractAddress, chainId = 1 }, context) => {
    try {
      // Validate address format
      if (!contractAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
        return {
          success: false,
          error: 'Invalid contract address format',
        };
      }

      const apiKey = process.env.ALCHEMY_API_KEY || process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
      if (!apiKey) {
        return {
          success: false,
          error: 'Alchemy API key not configured',
        };
      }

      // Determine network endpoint
      const networks: Record<number, string> = {
        1: 'eth-mainnet',
        11155111: 'eth-sepolia',
        8453: 'base-mainnet',
        84532: 'base-sepolia',
        137: 'polygon-mainnet',
        80002: 'polygon-amoy',
      };

      const network = networks[chainId] || 'eth-mainnet';
      const url = `https://${network}.g.alchemy.com/nft/v3/${apiKey}/getContractMetadata?contractAddress=${contractAddress}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Alchemy API error: ${response.status}`,
        };
      }

      const contract = await response.json();

      return {
        success: true,
        data: {
          address: contract.address,
          name: contract.name,
          symbol: contract.symbol,
          totalSupply: contract.totalSupply,
          tokenType: contract.tokenType,
          contractDeployer: contract.contractDeployer,
          deployedBlockNumber: contract.deployedBlockNumber,
          chainId,
          openSeaMetadata: contract.openSeaMetadata ? {
            floorPrice: contract.openSeaMetadata.floorPrice,
            collectionName: contract.openSeaMetadata.collectionName,
            safelistRequestStatus: contract.openSeaMetadata.safelistRequestStatus,
            imageUrl: contract.openSeaMetadata.imageUrl,
            description: contract.openSeaMetadata.description,
            externalUrl: contract.openSeaMetadata.externalUrl,
            twitterUsername: contract.openSeaMetadata.twitterUsername,
            discordUrl: contract.openSeaMetadata.discordUrl,
          } : undefined,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch contract metadata',
      };
    }
  }
});
