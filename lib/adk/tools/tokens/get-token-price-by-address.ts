import { createTool } from '@iqai/adk';
import { z } from 'zod';

// Network ID mapping for Alchemy Prices API
const NETWORK_NAMES: Record<number, string> = {
  1: 'eth-mainnet',
  11155111: 'eth-sepolia',
  8453: 'base-mainnet',
  84532: 'base-sepolia',
  137: 'matic-mainnet',
  42161: 'arb-mainnet',
  10: 'opt-mainnet',
};

export const tokenPriceByAddressTool = createTool({
  name: 'get_token_price_by_address',
  description: 'Get current price and 24h change for a token by its contract address (more accurate than symbol lookup)',
  schema: z.object({
    contractAddress: z.string().describe('Token contract address (0x...)'),
    chainId: z.number().optional().default(1).describe('Chain ID (1=Ethereum, 8453=Base, 137=Polygon, etc.)'),
  }),
  fn: async ({ contractAddress, chainId = 1 }, context) => {
    const apiKey = process.env.ALCHEMY_API_KEY || process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

    if (!apiKey) {
      throw new Error('Alchemy API key not configured. Please set ALCHEMY_API_KEY or NEXT_PUBLIC_ALCHEMY_API_KEY in your environment variables.');
    }

    // Validate contract address
    if (!contractAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      throw new Error('Invalid contract address format. Must be 0x followed by 40 hex characters.');
    }

    const networkName = NETWORK_NAMES[chainId];
    if (!networkName) {
      throw new Error(`Unsupported chain ID: ${chainId}. Supported chains: ${Object.keys(NETWORK_NAMES).join(', ')}`);
    }

    // Use Alchemy Prices API - by-address endpoint
    const response = await fetch(
      `https://api.g.alchemy.com/prices/v1/${apiKey}/tokens/by-address`,
      {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'x-alchemy-client-breadcrumb': 'adk-coinbase-terminal',
        },
        body: JSON.stringify({
          addresses: [{
            address: contractAddress,
            network: networkName,
          }]
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Alchemy API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    // Validate response structure
    if (!data.data || data.data.length === 0) {
      throw new Error(`No price data found for contract: ${contractAddress} on chain ${chainId}`);
    }

    const tokenData = data.data[0];

    // Check if prices exist
    if (!tokenData.prices || tokenData.prices.length === 0) {
      throw new Error(`No price information available for contract: ${contractAddress}`);
    }

    const priceInfo = tokenData.prices[0];

    return {
      success: true,
      data: {
        contractAddress,
        network: networkName,
        chainId,
        symbol: tokenData.symbol || 'UNKNOWN',
        name: tokenData.name || 'Unknown Token',
        price: priceInfo.value,
        currency: priceInfo.currency || 'USD',
        change24h: priceInfo.percentChange24h || 0,
        lastUpdated: priceInfo.lastUpdatedAt || new Date().toISOString(),
        formattedPrice: `$${priceInfo.value.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        })}`,
        priceChange: priceInfo.percentChange24h > 0 ? 'up' : priceInfo.percentChange24h < 0 ? 'down' : 'stable',
      },
    };
  }
});

