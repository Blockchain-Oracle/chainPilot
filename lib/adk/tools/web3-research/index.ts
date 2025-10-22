import { BaseTool } from '@iqai/adk';

// Core research tools
import { web3SearchTool } from './tools/search';
import { createResearchPlanTool } from './tools/create-research-plan';
import { researchTokenTool } from './tools/research-token';

// Additional research tools
import {
  researchWithKeywordsTool,
  updateStatusTool,
  fetchContentTool,
  searchSourceTool,
  listResourcesTool,
  getResearchStatusTool,
  completeResearchTool,
  listResearchSessionsTool,
} from './tools/additional-tools';

// Export all Web3 Research tools as an array
export const web3ResearchTools: BaseTool[] = [
  // Core tools
  web3SearchTool,
  createResearchPlanTool,
  researchTokenTool,
  
  // Additional tools
  researchWithKeywordsTool,
  updateStatusTool,
  fetchContentTool,
  searchSourceTool,
  listResourcesTool,
  getResearchStatusTool,
  completeResearchTool,
  listResearchSessionsTool,
];

// Export individual tools for granular usage
export {
  // Core tools
  web3SearchTool,
  createResearchPlanTool,
  researchTokenTool,
  
  // Additional tools
  researchWithKeywordsTool,
  updateStatusTool,
  fetchContentTool,
  searchSourceTool,
  listResourcesTool,
  getResearchStatusTool,
  completeResearchTool,
  listResearchSessionsTool,
};

// Tool categories for UI organization
export const web3ResearchToolCategories = {
  search: [web3SearchTool, searchSourceTool],
  planning: [createResearchPlanTool, updateStatusTool, getResearchStatusTool],
  research: [researchTokenTool, researchWithKeywordsTool],
  content: [fetchContentTool, listResourcesTool],
  management: [completeResearchTool, listResearchSessionsTool],
};

// Helper function to get Web3 Research tools
export async function getWeb3ResearchTools(): Promise<BaseTool[]> {
  return web3ResearchTools;
}
