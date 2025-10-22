import { createTool } from '@iqai/adk';
import { getWeb3ResearchService } from '../web3-research-service';
import { getResearchStorage } from '../storage/research-storage';
import { z } from 'zod';

export const researchTokenTool = createTool({
  name: 'research_token',
  description: 'Perform comprehensive research on a token by searching multiple sources and aggregating information',
  schema: z.object({
    tokenName: z.string().describe('The full name of the token'),
    tokenTicker: z.string().describe('The token ticker symbol'),
    keywords: z.array(z.string()).optional().describe('Specific keywords to focus the research on'),
    researchId: z.string().optional().describe('Optional research ID to continue existing research'),
  }),
  fn: async ({ tokenName, tokenTicker, keywords = [], researchId }, context) => {
    // Track query in conversation state
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'research_token',
      params: { tokenName, tokenTicker, keywords, researchId },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    // Remember last query details
    context.state.set('last_queried_tool', 'research_token');
    context.state.set('last_researched_token', { tokenName, tokenTicker });

    try {
      const research = getWeb3ResearchService();
      const storage = getResearchStorage();

      // Use existing research or create new one
      let currentResearchId = researchId;
      if (!currentResearchId) {
        currentResearchId = await storage.startNewResearch(tokenName, tokenTicker);
        const plan = research.createResearchPlan(tokenName, tokenTicker);
        await storage.updateSection(currentResearchId, 'researchPlan', plan);
      }

      // Perform keyword-based research
      const keywordResults = await research.researchWithKeywords(
        tokenName,
        tokenTicker,
        keywords.length > 0 ? keywords : ['overview', 'tokenomics', 'price', 'news'],
        currentResearchId
      );

      // Get research status
      const status = await research.getResearchStatus(currentResearchId);

      const result = {
        success: true,
        data: {
          researchId: currentResearchId,
          tokenName,
          tokenTicker,
          keywordResults,
          keywords,
          status,
          timestamp: Date.now(),
        },
      };

      // Store result in state
      context.state.set('last_result', result.data);
      context.state.set('last_token_research', result.data);
      context.state.set('current_research_id', currentResearchId);

      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to research token',
      };
    }
  }
});
