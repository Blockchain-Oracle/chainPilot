/**
 * Web3 Research Service - Complete Implementation
 * 
 * Comprehensive research service with Redis storage and DuckDuckGo search
 * Includes all features from the original Web3 Research MCP
 */

import { getResearchStorage, ResearchData, ResearchPlan } from './storage/research-storage';
import { performSearch, fetchContent, searchSource, searchMultipleSources, SearchResponse } from './utils/search-utils';

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
}

export interface FetchContentResponse {
  title: string;
  content: string;
  metadata: {
    url: string;
  };
  url: string;
  timestamp: number;
}

class Web3ResearchService {
  private storage = getResearchStorage();

  /**
   * Perform web search using DuckDuckGo (no API keys needed)
   */
  async performSearch(query: string, searchType: 'web' | 'news' | 'images' | 'videos' = 'web'): Promise<SearchResult[]> {
    try {
      console.log(`[Web3Research] Performing ${searchType} search for: "${query}"`);
      const results = await performSearch(query, searchType);
      
      const searchResults = (results.results || []).map((result: any) => ({
        title: result.title || 'No title',
        url: result.url || '#',
        snippet: result.description || result.snippet || 'No description available',
        publishedDate: result.published_date,
      }));

      console.log(`[Web3Research] Found ${searchResults.length} results for "${query}"`);
      return searchResults;
    } catch (error: any) {
      console.error(`[Web3Research] Search failed for "${query}":`, error.message);
      return this.getMockSearchResults(query);
    }
  }

  private getMockSearchResults(query: string): SearchResult[] {
    return [
      {
        title: `Research Query: ${query}`,
        url: 'https://duckduckgo.com',
        snippet: 'Search service is temporarily unavailable. The Web3 Research service uses DuckDuckGo for searches without requiring API keys. Please try again in a moment.',
        publishedDate: new Date().toISOString(),
      },
    ];
  }

  /**
   * Create comprehensive research plan for a token
   */
  createResearchPlan(tokenName: string, tokenTicker: string): ResearchPlan {
    return {
      projectInfo: {
        description: "Gather basic information about the project",
        sources: ["Project website", "Documentation", "CoinMarketCap"],
        status: "planned" as const,
      },
      technicalFundamentals: {
        description: "Analyze the token's technical aspects",
        sources: ["Documentation", "GitHub", "IQ Wiki", "Token contract"],
        status: "planned" as const,
      },
      marketStatus: {
        description: "Evaluate current market performance",
        sources: ["CoinMarketCap", "TradingView", "GeckoTerminal"],
        status: "planned" as const,
      },
      listings: {
        description: "Find where the token is traded",
        sources: ["GeckoTerminal", "CoinMarketCap"],
        status: "planned" as const,
      },
      news: {
        description: "Gather recent news about the token",
        sources: ["Crypto news sites", "Twitter", "Medium"],
        status: "planned" as const,
      },
      community: {
        description: "Analyze the project's community",
        sources: ["Twitter", "Discord", "Telegram", "Reddit"],
        status: "planned" as const,
      },
      predictions: {
        description: "Collect price predictions and forecasts",
        sources: ["Analysis sites", "Expert opinions"],
        status: "planned" as const,
      },
      teamInfo: {
        description: "Research the team behind the project",
        sources: ["Project website", "LinkedIn", "Twitter"],
        status: "planned" as const,
      },
      relatedCoins: {
        description: "Identify tokens in the same category",
        sources: ["GeckoTerminal", "CoinMarketCap"],
        status: "planned" as const,
      },
      socialSentiment: {
        description: "Gauge social media sentiment",
        sources: ["Twitter", "Reddit", "Trading forums"],
        status: "planned" as const,
      },
    };
  }

  /**
   * Fetch content from a URL
   */
  async fetchContent(url: string, format: 'text' | 'html' | 'markdown' | 'json' = 'markdown'): Promise<FetchContentResponse> {
    try {
      console.log(`[Web3Research] Fetching content from: ${url} (format: ${format})`);
      const content = await fetchContent(url, format);
      
      return {
        title: url,
        content,
        metadata: { url },
        url,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`[Web3Research] Failed to fetch content from ${url}:`, error.message);
      throw new Error(`Failed to fetch content from ${url}: ${error.message}`);
    }
  }

  /**
   * Research with specific keywords
   */
  async researchWithKeywords(
    tokenName: string,
    tokenTicker: string,
    keywords: string[],
    researchId: string
  ): Promise<Record<string, SearchResult[]>> {
    console.log(`[Web3Research] Starting keyword research for ${tokenName} (${tokenTicker}) with ${keywords.length} keywords`);
    const results: Record<string, SearchResult[]> = {};

    for (const keyword of keywords) {
      const query = `${tokenName} ${tokenTicker} ${keyword}`;
      await this.storage.addLogEntry(researchId, `Searching for: ${query}`);

      try {
        await sleep(2000); // Rate limiting
        const searchResults = await this.performSearch(query, 'web');

        if (searchResults.length === 0) {
          console.log(`[Web3Research] No results found for keyword: ${keyword}`);
          results[keyword] = [];
          continue;
        }

        const topResults = searchResults.slice(0, 3);
        results[keyword] = topResults;

        await this.storage.addToSection(researchId, 'searchResults', { [keyword]: topResults });
        console.log(`[Web3Research] Found ${topResults.length} results for keyword: ${keyword}`);
      } catch (error: any) {
        console.error(`[Web3Research] Error researching keyword "${keyword}":`, error.message);
        results[keyword] = [];
      }
    }

    // Save combined results as resource
    const resourceId = `combined_search_${tokenName.toLowerCase()}_${Date.now()}`;
    await this.storage.addResource(researchId, resourceId, {
      url: `research://resource/${resourceId}`,
      format: 'json',
      content: JSON.stringify(results, null, 2),
      title: `Combined search results for ${tokenName}`,
      fetchedAt: new Date().toISOString(),
    });

    console.log(`[Web3Research] Completed keyword research for ${tokenName}, saved ${Object.keys(results).length} keyword results`);
    return results;
  }

  /**
   * Search specific source
   */
  async searchSource(
    tokenName: string,
    tokenTicker: string,
    source: string,
    researchId: string
  ): Promise<SearchResult[]> {
    console.log(`[Web3Research] Searching ${source} for ${tokenName} (${tokenTicker})`);
    await this.storage.addLogEntry(researchId, `Searching ${source} for ${tokenName} (${tokenTicker})`);

    try {
      const results = await searchSource(tokenName, tokenTicker, source);
      
      await this.storage.addToSection(researchId, 'searchResults', { [source]: results });

      const searchResults = (results.results || []).map((result: any) => ({
        title: result.title || 'No title',
        url: result.url || '#',
        snippet: result.description || 'No description available',
        publishedDate: result.published_date,
      }));

      console.log(`[Web3Research] Found ${searchResults.length} results from ${source} for ${tokenName}`);

      // Try to fetch content from top result
      if (searchResults.length > 0 && searchResults[0].url && searchResults[0].url !== '#') {
        try {
          console.log(`[Web3Research] Attempting to fetch content from top result: ${searchResults[0].url}`);
          await sleep(3000);
          const content = await this.fetchContent(searchResults[0].url, 'text');
          
          const resourceId = `${source.toLowerCase()}_${tokenName.toLowerCase()}_${Date.now()}`;
          await this.storage.addResource(researchId, resourceId, {
            url: searchResults[0].url,
            format: 'text',
            content: content.content,
            source,
            fetchedAt: new Date().toISOString(),
          });
          
          console.log(`[Web3Research] Successfully saved content from ${source} as resource: ${resourceId}`);
        } catch (fetchError: any) {
          console.warn(`[Web3Research] Could not fetch content from ${searchResults[0].url}:`, fetchError.message);
        }
      }

      return searchResults;
    } catch (error: any) {
      console.error(`[Web3Research] Error searching ${source} for ${tokenName}:`, error.message);
      return [];
    }
  }

  /**
   * Update research section status
   */
  async updateSectionStatus(
    researchId: string,
    section: string,
    status: 'planned' | 'in_progress' | 'completed'
  ): Promise<void> {
    const research = await this.storage.getResearch(researchId);
    if (!research || !research.researchPlan[section]) {
      throw new Error(`Section '${section}' not found in research plan`);
    }

    const updatedSection = {
      ...research.researchPlan[section],
      status,
    };

    const updatedPlan = {
      ...research.researchPlan,
      [section]: updatedSection,
    };

    await this.storage.updateSection(researchId, 'researchPlan', updatedPlan);
    await this.storage.addLogEntry(researchId, `Updated status of ${section} to ${status}`);
  }

  /**
   * Get research status
   */
  async getResearchStatus(researchId: string): Promise<{
    tokenName: string;
    tokenTicker: string;
    status: string;
    progress: Record<string, string>;
  }> {
    const research = await this.storage.getResearch(researchId);
    if (!research) {
      throw new Error(`Research not found: ${researchId}`);
    }

    const progress: Record<string, string> = {};
    Object.entries(research.researchPlan).forEach(([key, value]) => {
      progress[key] = value.status;
    });

    return {
      tokenName: research.tokenName,
      tokenTicker: research.tokenTicker,
      status: research.status,
      progress,
    };
  }

  /**
   * List all resources for research
   */
  async listResources(researchId: string): Promise<Array<{
    id: string;
    url: string;
    title?: string;
    source?: string;
    contentLength: number;
    fetchedAt: string;
  }>> {
    const resources = await this.storage.getAllResources(researchId);
    
    return Object.keys(resources).map((id) => ({
      id,
      url: resources[id].url,
      title: resources[id].title || 'No title',
      source: resources[id].source || 'Unknown',
      contentLength: resources[id].content?.length || 0,
      fetchedAt: resources[id].fetchedAt,
    }));
  }

  /**
   * Complete research
   */
  async completeResearch(researchId: string): Promise<void> {
    await this.storage.completeResearch(researchId);
  }

  /**
   * Get research logs
   */
  async getResearchLogs(researchId: string): Promise<Array<{ timestamp: string; message: string }>> {
    const research = await this.storage.getResearch(researchId);
    if (!research) {
      return [];
    }
    return research.logs;
  }

  /**
   * Check if service is configured (always true for DuckDuckGo)
   */
  isConfigured(): boolean {
    return true; // DuckDuckGo doesn't require API keys
  }

  getConfigStatus() {
    return {
      duckduckgo: true,
      tavily: false,
      serper: false,
      hasAnyKey: true,
    };
  }
}

// Helper function for sleep
const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Singleton instance
let web3ResearchServiceInstance: Web3ResearchService | null = null;

export function getWeb3ResearchService(): Web3ResearchService {
  if (!web3ResearchServiceInstance) {
    web3ResearchServiceInstance = new Web3ResearchService();
  }
  return web3ResearchServiceInstance;
}

export { Web3ResearchService };