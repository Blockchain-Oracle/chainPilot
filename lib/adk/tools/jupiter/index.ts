import { BaseTool } from '@iqai/adk';

// Jupiter API tools
import { jupiterSearchTokensTool } from './tokens/search-tokens';
import { jupiterGetSwapQuoteTool } from './tokens/get-swap-quote';
import { jupiterGetRoutersTool } from './tokens/get-routers';
import { jupiterGetDBCPoolTool } from './tokens/get-dbc-pool';

// Jupiter Plugin tool
import { jupiterShowPluginTool } from './plugin/show-plugin';

// Export all Jupiter tools as an array
export const jupiterTools: BaseTool[] = [
  jupiterSearchTokensTool,
  jupiterGetSwapQuoteTool,
  jupiterGetRoutersTool,
  jupiterGetDBCPoolTool,
  jupiterShowPluginTool,
];

// Export individual tools for granular usage
export {
  jupiterSearchTokensTool,
  jupiterGetSwapQuoteTool,
  jupiterGetRoutersTool,
  jupiterGetDBCPoolTool,
  jupiterShowPluginTool,
};

// Tool categories for UI organization
export const jupiterToolCategories = {
  search: [jupiterSearchTokensTool],
  swap: [jupiterGetSwapQuoteTool, jupiterGetRoutersTool],
  pools: [jupiterGetDBCPoolTool],
  plugin: [jupiterShowPluginTool],
};

// Helper function to get Jupiter tools
export async function getJupiterTools(): Promise<BaseTool[]> {
  return jupiterTools;
}
