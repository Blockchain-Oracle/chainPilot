import { createTool } from '@iqai/adk';
import { getWeb3ResearchService } from '../web3-research-service';
import { getResearchStorage } from '../storage/research-storage';
import { z } from 'zod';

export const researchWithKeywordsTool = createTool({
  name: 'research_with_keywords',
  description: 'Research a token with specific keywords and save results to storage',
  schema: z.object({
    tokenName: z.string().describe('Name of the token'),
    tokenTicker: z.string().describe('Ticker symbol of the token'),
    keywords: z.array(z.string()).describe('Keywords to search for'),
    researchId: z.string().describe('Research ID to associate results with'),
  }),
  fn: async ({ tokenName, tokenTicker, keywords, researchId }, context) => {
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'research_with_keywords',
      params: { tokenName, tokenTicker, keywords, researchId },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    try {
      const research = getWeb3ResearchService();
      
      const results = await research.researchWithKeywords(
        tokenName,
        tokenTicker,
        keywords,
        researchId
      );

      return {
        success: true,
        data: {
          tokenName,
          tokenTicker,
          keywords,
          results,
          researchId,
          timestamp: Date.now(),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to research with keywords',
      };
    }
  }
});

export const updateStatusTool = createTool({
  name: 'update_research_status',
  description: 'Update the status of a research section (planned, in_progress, completed)',
  schema: z.object({
    researchId: z.string().describe('Research ID'),
    section: z.string().describe('Section name to update (e.g., projectInfo, technicalFundamentals)'),
    status: z.enum(['planned', 'in_progress', 'completed']).describe('New status for the section'),
  }),
  fn: async ({ researchId, section, status }, context) => {
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'update_research_status',
      params: { researchId, section, status },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    try {
      const research = getWeb3ResearchService();
      
      await research.updateSectionStatus(researchId, section, status);

      return {
        success: true,
        data: {
          researchId,
          section,
          status,
          timestamp: Date.now(),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update research status',
      };
    }
  }
});

export const fetchContentTool = createTool({
  name: 'fetch_content',
  description: 'Fetch content from a URL and save it as a resource',
  schema: z.object({
    url: z.string().describe('URL to fetch content from'),
    format: z.enum(['text', 'html', 'markdown', 'json']).optional().default('markdown').describe('Output format'),
    researchId: z.string().optional().describe('Optional research ID to save content to'),
  }),
  fn: async ({ url, format = 'markdown', researchId }, context) => {
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'fetch_content',
      params: { url, format, researchId },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    try {
      const research = getWeb3ResearchService();
      const storage = getResearchStorage();
      
      const content = await research.fetchContent(url, format);

      // Save as resource if researchId provided
      if (researchId) {
        const resourceId = url.replace(/https?:\/\//, '').replace(/[^\w]/g, '_').substring(0, 30) + '_' + Date.now();
        await storage.addResource(researchId, resourceId, {
          url,
          format,
          content: content.content,
          title: content.title,
          fetchedAt: new Date().toISOString(),
        });
      }

      return {
        success: true,
        data: {
          url,
          format,
          content,
          researchId,
          timestamp: Date.now(),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch content',
      };
    }
  }
});

export const searchSourceTool = createTool({
  name: 'search_source',
  description: 'Search for information about a token from a specific source',
  schema: z.object({
    tokenName: z.string().describe('Name of the token'),
    tokenTicker: z.string().describe('Ticker symbol of the token'),
    source: z.string().describe('Source to search (e.g., CoinMarketCap, DeFiLlama, News)'),
    researchId: z.string().describe('Research ID to associate results with'),
  }),
  fn: async ({ tokenName, tokenTicker, source, researchId }, context) => {
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'search_source',
      params: { tokenName, tokenTicker, source, researchId },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    try {
      const research = getWeb3ResearchService();
      
      const results = await research.searchSource(tokenName, tokenTicker, source, researchId);

      return {
        success: true,
        data: {
          tokenName,
          tokenTicker,
          source,
          results,
          researchId,
          timestamp: Date.now(),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to search source',
      };
    }
  }
});

export const listResourcesTool = createTool({
  name: 'list_resources',
  description: 'List all resources saved for a research session',
  schema: z.object({
    researchId: z.string().describe('Research ID to list resources for'),
  }),
  fn: async ({ researchId }, context) => {
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'list_resources',
      params: { researchId },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    try {
      const research = getWeb3ResearchService();
      
      const resources = await research.listResources(researchId);

      return {
        success: true,
        data: {
          researchId,
          resources,
          timestamp: Date.now(),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to list resources',
      };
    }
  }
});

export const getResearchStatusTool = createTool({
  name: 'get_research_status',
  description: 'Get the current status and progress of a research session',
  schema: z.object({
    researchId: z.string().describe('Research ID to get status for'),
  }),
  fn: async ({ researchId }, context) => {
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'get_research_status',
      params: { researchId },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    try {
      const research = getWeb3ResearchService();
      
      const status = await research.getResearchStatus(researchId);
      const logs = await research.getResearchLogs(researchId);

      return {
        success: true,
        data: {
          researchId,
          status,
          logs,
          timestamp: Date.now(),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get research status',
      };
    }
  }
});

export const completeResearchTool = createTool({
  name: 'complete_research',
  description: 'Mark a research session as completed',
  schema: z.object({
    researchId: z.string().describe('Research ID to complete'),
  }),
  fn: async ({ researchId }, context) => {
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'complete_research',
      params: { researchId },
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    try {
      const research = getWeb3ResearchService();
      
      await research.completeResearch(researchId);

      return {
        success: true,
        data: {
          researchId,
          status: 'completed',
          timestamp: Date.now(),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to complete research',
      };
    }
  }
});

export const listResearchSessionsTool = createTool({
  name: 'list_research_sessions',
  description: 'List all research sessions',
  schema: z.object({}),
  fn: async ({}, context) => {
    const queryHistory = context.state.get('query_history', []);
    queryHistory.push({
      tool: 'list_research_sessions',
      params: {},
      timestamp: new Date().toISOString(),
    });
    context.state.set('query_history', queryHistory);

    try {
      const storage = getResearchStorage();
      
      const sessions = await storage.listResearchSessions();

      return {
        success: true,
        data: {
          sessions,
          timestamp: Date.now(),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to list research sessions',
      };
    }
  }
});
