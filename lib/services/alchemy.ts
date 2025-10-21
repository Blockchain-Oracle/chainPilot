import { Alchemy, Network, Utils, AssetTransfersCategory } from 'alchemy-sdk';
import { formatUnits } from 'viem';

// Network configuration mapping
const NETWORK_CONFIGS: Record<number, Network> = {
  1: Network.ETH_MAINNET,
  11155111: Network.ETH_SEPOLIA,
  8453: Network.BASE_MAINNET,
  84532: Network.BASE_SEPOLIA,
  42161: Network.ARB_MAINNET,
  421614: Network.ARB_SEPOLIA,
  10: Network.OPT_MAINNET,
  11155420: Network.OPT_SEPOLIA,
  137: Network.MATIC_MAINNET,
  80002: Network.MATIC_AMOY,
};

// Chain name mapping for display
export const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum',
  11155111: 'Sepolia',
  8453: 'Base',
  84532: 'Base Sepolia',
  42161: 'Arbitrum',
  421614: 'Arbitrum Sepolia',
  10: 'Optimism',
  11155420: 'Optimism Sepolia',
  137: 'Polygon',
  80002: 'Polygon Amoy',
};

// Explorer URLs for transaction links
export const EXPLORER_URLS: Record<number, string> = {
  1: 'https://etherscan.io',
  11155111: 'https://sepolia.etherscan.io',
  8453: 'https://basescan.org',
  84532: 'https://sepolia.basescan.org',
  42161: 'https://arbiscan.io',
  421614: 'https://sepolia.arbiscan.io',
  10: 'https://optimistic.etherscan.io',
  11155420: 'https://sepolia-optimism.etherscan.io',
  137: 'https://polygonscan.com',
  80002: 'https://amoy.polygonscan.com',
};

export class AlchemyService {
  private instances: Map<number, Alchemy> = new Map();
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ALCHEMY_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('Alchemy API key is required');
    }
  }

  // Get or create an Alchemy instance for a specific chain
  private getAlchemy(chainId: number): Alchemy {
    if (!this.instances.has(chainId)) {
      const network = NETWORK_CONFIGS[chainId];
      if (!network) {
        throw new Error(`Unsupported chain ID: ${chainId}. Supported chains: ${Object.keys(CHAIN_NAMES).join(', ')}`);
      }

      const alchemy = new Alchemy({
        apiKey: this.apiKey,
        network,
      });
      this.instances.set(chainId, alchemy);
    }
    return this.instances.get(chainId)!;
  }

  // Get native balance (ETH, MATIC, etc.)
  async getNativeBalance(address: string, chainId: number = 1): Promise<{
    balance: string;
    symbol: string;
    chainName: string;
  }> {
    const alchemy = this.getAlchemy(chainId);
    const balance = await alchemy.core.getBalance(address);

    const symbol = this.getNativeTokenSymbol(chainId);
    return {
      balance: formatUnits(BigInt(balance.toString()), 18),
      symbol,
      chainName: CHAIN_NAMES[chainId],
    };
  }

  // Get ERC20 token balances
  async getTokenBalances(address: string, chainId: number = 1): Promise<Array<{
    contractAddress: string;
    symbol: string;
    name: string;
    decimals: number;
    balance: string;
    logo?: string;
  }>> {
    const alchemy = this.getAlchemy(chainId);
    const balances = await alchemy.core.getTokenBalances(address);

    const tokens = [];
    for (const token of balances.tokenBalances) {
      if (BigInt(token.tokenBalance || 0) > 0n) {
        try {
          const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
          tokens.push({
            contractAddress: token.contractAddress,
            symbol: metadata.symbol || 'UNKNOWN',
            name: metadata.name || 'Unknown Token',
            decimals: metadata.decimals || 18,
            balance: formatUnits(
              BigInt(token.tokenBalance || 0),
              metadata.decimals || 18
            ),
            logo: metadata.logo || undefined,
          });
        } catch (error) {
          console.error(`Error fetching metadata for ${token.contractAddress}:`, error);
        }
      }
    }

    return tokens;
  }

  // Get NFTs owned by address
  async getNFTsOwned(address: string, chainId: number = 1): Promise<Array<{
    contract: string;
    tokenId: string;
    name: string;
    description?: string;
    image?: string;
    collection: string;
    tokenType: string;
  }>> {
    const alchemy = this.getAlchemy(chainId);
    const nfts = await alchemy.nft.getNftsForOwner(address);

    return nfts.ownedNfts.map(nft => ({
      contract: nft.contract.address,
      tokenId: nft.tokenId,
      name: nft.name || `${nft.contract.name} #${nft.tokenId}`,
      description: nft.description,
      image: nft.image.originalUrl || nft.image.thumbnailUrl,
      collection: nft.contract.name || 'Unknown Collection',
      tokenType: nft.contract.tokenType || 'ERC721',
    }));
  }

  // Get transaction history
  async getTransactionHistory(address: string, chainId: number = 1, limit: number = 10): Promise<Array<{
    hash: string;
    from: string;
    to: string;
    value: string;
    blockNumber: number;
    timestamp?: number;
    status: 'success' | 'failed' | 'pending';
  }>> {
    const alchemy = this.getAlchemy(chainId);
    
    const transfers = await alchemy.core.getAssetTransfers({
      fromAddress: address,
      category: [
        AssetTransfersCategory.EXTERNAL,
        AssetTransfersCategory.INTERNAL,
        AssetTransfersCategory.ERC20,
        AssetTransfersCategory.ERC721,
        AssetTransfersCategory.ERC1155
      ],
      maxCount: limit,
    });

    const outgoing = transfers.transfers.map(tx => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to || '',
      value: tx.value?.toString() || '0',
      blockNumber: parseInt(tx.blockNum, 16),
      timestamp: undefined,
      status: 'success' as const,
      direction: 'out' as const,
    }));

    const incoming = await alchemy.core.getAssetTransfers({
      toAddress: address,
      category: [
        AssetTransfersCategory.EXTERNAL,
        AssetTransfersCategory.INTERNAL,
        AssetTransfersCategory.ERC20,
        AssetTransfersCategory.ERC721,
        AssetTransfersCategory.ERC1155
      ],
      maxCount: limit,
    });

    const incomingTxs = incoming.transfers.map(tx => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to || '',
      value: tx.value?.toString() || '0',
      blockNumber: parseInt(tx.blockNum, 16),
      timestamp: undefined,
      status: 'success' as const,
      direction: 'in' as const,
    }));

    // Combine and sort by block number
    return [...outgoing, ...incomingTxs]
      .sort((a, b) => b.blockNumber - a.blockNumber)
      .slice(0, limit);
  }

  // Get current gas prices
  async getGasPrice(chainId: number = 1): Promise<{
    slow: string;
    standard: string;
    fast: string;
  }> {
    const alchemy = this.getAlchemy(chainId);
    const gasPrice = await alchemy.core.getGasPrice();
    const gasPriceGwei = formatUnits(BigInt(gasPrice.toString()), 9);
    const basePrice = parseFloat(gasPriceGwei);

    return {
      slow: (basePrice * 0.8).toFixed(2),
      standard: basePrice.toFixed(2),
      fast: (basePrice * 1.2).toFixed(2),
    };
  }

  // Resolve ENS name to address
  async resolveENS(ensName: string): Promise<string | null> {
    const alchemy = this.getAlchemy(1); // ENS only on mainnet
    return await alchemy.core.resolveName(ensName);
  }

  // Get ENS name for address
  async lookupENS(address: string): Promise<string | null> {
    const alchemy = this.getAlchemy(1); // ENS only on mainnet
    return await alchemy.core.lookupAddress(address);
  }

  // Estimate gas for a transaction
  async estimateGas(
    from: string,
    to: string,
    value: string,
    data?: string,
    chainId: number = 1
  ): Promise<{
    gasLimit: string;
    gasPrice: string;
    estimatedCost: string;
  }> {
    const alchemy = this.getAlchemy(chainId);

    const gasEstimate = await alchemy.core.estimateGas({
      from,
      to,
      value: Utils.parseEther(value).toString(),
      data,
    });

    const gasPrice = await alchemy.core.getGasPrice();
    const estimatedCost = formatUnits(
      BigInt(gasEstimate.toString()) * BigInt(gasPrice.toString()),
      18
    );

    return {
      gasLimit: gasEstimate.toString(),
      gasPrice: formatUnits(BigInt(gasPrice.toString()), 9),
      estimatedCost,
    };
  }

  // Get token price using Alchemy Prices API
  async getTokenPrice(symbol: string, chainId: number = 1): Promise<{
    usd: number;
    change24h: number;
  }> {
    const apiKey = process.env.ALCHEMY_API_KEY || process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
    
    if (!apiKey) {
      throw new Error('Alchemy API key not configured. Please set ALCHEMY_API_KEY or NEXT_PUBLIC_ALCHEMY_API_KEY in your environment variables.');
    }

    // Use Alchemy Prices API
    const response = await fetch(
      `https://api.g.alchemy.com/prices/v1/${apiKey}/tokens/by-symbol?symbols=${symbol.toUpperCase()}`,
      {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'x-alchemy-client-breadcrumb': 'adk-coinbase-terminal',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Alchemy API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract price data from response
    if (!data.data || data.data.length === 0) {
      throw new Error(`No price data found for token: ${symbol}`);
    }

    const tokenData = data.data[0];
    if (!tokenData.prices || tokenData.prices.length === 0) {
      throw new Error(`No price information available for token: ${symbol}`);
    }

    return {
      usd: tokenData.prices[0].value,
      change24h: tokenData.prices[0].percentChange24h || 0,
    };
  }

  // Helper to get native token symbol for a chain
  private getNativeTokenSymbol(chainId: number): string {
    const symbols: Record<number, string> = {
      1: 'ETH',
      11155111: 'ETH',
      8453: 'ETH',
      84532: 'ETH',
      42161: 'ETH',
      421614: 'ETH',
      10: 'ETH',
      11155420: 'ETH',
      137: 'MATIC',
      80002: 'MATIC',
    };
    return symbols[chainId] || 'ETH';
  }

  // Get explorer URL for a transaction
  getExplorerUrl(txHash: string, chainId: number = 1): string {
    const baseUrl = EXPLORER_URLS[chainId] || EXPLORER_URLS[1];
    return `${baseUrl}/tx/${txHash}`;
  }

  // Get explorer URL for an address
  getAddressExplorerUrl(address: string, chainId: number = 1): string {
    const baseUrl = EXPLORER_URLS[chainId] || EXPLORER_URLS[1];
    return `${baseUrl}/address/${address}`;
  }
}

// Singleton instance
let alchemyService: AlchemyService | null = null;

export function getAlchemyService(): AlchemyService {
  if (!alchemyService) {
    alchemyService = new AlchemyService();
  }
  return alchemyService;
}