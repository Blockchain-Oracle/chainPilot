/**
 * Jupiter Ultra API Service
 * Handles API requests to Jupiter Ultra API for token search and swap quotes
 *
 * Documentation: https://station.jup.ag/docs/apis/ultra-api
 */

import {
  JUPITER_BASE_URLS,
  JUPITER_ENDPOINTS,
  type JupiterAPIConfig,
} from '@/lib/ai/tools/jupiter/types';

class JupiterService {
  private apiKey: string;
  private tier: 'free' | 'paid';
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.JUPITER_API_KEY || '';
    this.tier = 'free';
    this.baseUrl = JUPITER_BASE_URLS[this.tier];

    if (!this.apiKey) {
      console.log('ℹ️  Using Jupiter free tier (rate limited)');
    } else {
      console.log('✅ Using Jupiter paid tier with API key');
    }
  }

  /**
   * Make a request to Jupiter Ultra API
   */
  private async makeRequest<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            url.searchParams.append(key, value.join(','));
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add API key if using paid tier
    if (this.tier === 'free') {
      headers['X-API-KEY'] = this.apiKey;
    }

    try {
      const response = await fetch(url.toString(), { headers });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Jupiter API error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Jupiter API request failed:', error);
      throw new Error(`Failed to fetch from Jupiter: ${error.message}`);
    }
  }

  /**
   * Search for tokens by symbol, name, or mint address
   */
  async searchTokens(query: string) {
    return this.makeRequest(JUPITER_ENDPOINTS.ultra.search, { query });
  }

  /**
   * Get swap quote/order
   */
  async getOrder(params: {
    inputMint: string;
    outputMint: string;
    amount: string;
    taker?: string;
    referralAccount?: string;
    referralFee?: number;
    excludeRouters?: string[];
    excludeDexes?: string;
    payer?: string;
  }) {
    return this.makeRequest(JUPITER_ENDPOINTS.ultra.order, params);
  }

  /**
   * Get available routers
   */
  async getRouters() {
    return this.makeRequest(JUPITER_ENDPOINTS.ultra.routers);
  }

  /**
   * Get DBC pool addresses for a token
   */
  async getDBCPoolAddresses(mint: string) {
    return this.makeRequest(`${JUPITER_ENDPOINTS.studio.dbcPoolAddresses}/${mint}`);
  }

  /**
   * Get API tier info
   */
  getTierInfo() {
    return {
      tier: this.tier,
      hasApiKey: Boolean(this.apiKey),
      baseUrl: this.baseUrl,
    };
  }

  /**
   * Check if service is configured
   */
  isConfigured(): boolean {
    return true; // Always works, free tier is default
  }
}

// Singleton instance
let jupiterServiceInstance: JupiterService | null = null;

export function getJupiterService(): JupiterService {
  if (!jupiterServiceInstance) {
    jupiterServiceInstance = new JupiterService();
  }
  return jupiterServiceInstance;
}

export { JupiterService };
