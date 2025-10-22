import { createTool } from '@iqai/adk';
import { getWeb3ResearchService } from '../web3-research-service';
import { getResearchStorage } from '../storage/research-storage';
import { z } from 'zod';

export const web3SearchTool = createTool({
  name: 'web3_search',
  description: 'Search the web for information about tokens, projects, or crypto-related topics using DuckDuckGo',
  schema: z.object({
    query: z.string().describe('The search query'),
    searchType: z.enum(['web', 'news', 'images', 'videos']).optional().default('web').describe('Type of search to perform'),
    researchId: z.string().optional().describe('Optional research ID to associate results with'),
  }),
  fn: async ({ query, searchType = 'web', researchId }, context) => {
    // Track query in conversation state
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'web3_search',
      params: { query, searchType, researchId },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    // Remember last query details
    context.state.set('last_queried_tool', 'web3_search');
    context.state.set('last_search_query', query);

    try {
      const research = getWeb3ResearchService();
      const storage = getResearchStorage();

      const results = await research.performSearch(query, searchType);

      // If researchId provided, log the search
      if (researchId) {
        await storage.addLogEntry(researchId, `Performed ${searchType} search for: "${query}"`);
        await storage.addToSection(researchId, 'searchResults', {
          [searchType]: {
            [query]: results,
          },
        });
      }

      const result = {
        success: true,
        data: {
          query,
          searchType,
          results,
          timestamp: Date.now(),
          researchId,
        },
        config: research.getConfigStatus(),
      };

      // Store result in state
      context.state.set('last_result', result.data);
      context.state.set('last_search_results', results);

      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to perform search',
      };
    }
  }
});
