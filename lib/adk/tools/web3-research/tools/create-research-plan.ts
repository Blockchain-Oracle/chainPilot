import { createTool } from '@iqai/adk';
import { getWeb3ResearchService } from '../web3-research-service';
import { getResearchStorage } from '../storage/research-storage';
import { z } from 'zod';

export const createResearchPlanTool = createTool({
  name: 'create_research_plan',
  description: 'Create a structured research plan for investigating a cryptocurrency token and start a new research session',
  schema: z.object({
    tokenName: z.string().describe('The full name of the token'),
    tokenTicker: z.string().describe('The token ticker symbol (e.g., BTC, ETH, SOL)'),
  }),
  fn: async ({ tokenName, tokenTicker }, context) => {
    // Track query in conversation state
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'create_research_plan',
      params: { tokenName, tokenTicker },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    // Remember last query details
    context.state.set('last_queried_tool', 'create_research_plan');
    context.state.set('last_researched_token', { tokenName, tokenTicker });

    try {
      const research = getWeb3ResearchService();
      const storage = getResearchStorage();

      // Start new research session
      const researchId = await storage.startNewResearch(tokenName, tokenTicker);
      
      // Create comprehensive research plan
      const plan = research.createResearchPlan(tokenName, tokenTicker);
      
      // Save the plan to storage
      await storage.updateSection(researchId, 'researchPlan', plan);

      const result = {
        success: true,
        data: {
          researchId,
          tokenName,
          tokenTicker,
          plan,
          createdAt: Date.now(),
          status: 'in_progress',
        },
      };

      // Store result in state
      context.state.set('last_result', result.data);
      context.state.set('last_research_plan', plan);
      context.state.set('current_research_id', researchId);

      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create research plan',
      };
    }
  }
});
