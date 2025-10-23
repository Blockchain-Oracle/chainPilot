/**
 * Web3 Research UI Components
 * Beautiful React components for displaying Web3 Research results
 * 
 * All components are wrapped with error handling to prevent crashes from undefined data
 */

import { withCardErrorHandling } from './CardWrapper';
import { SearchResultsCard as SearchResultsCardRaw } from './SearchResultsCard';
import { ResearchPlanCard as ResearchPlanCardRaw } from './ResearchPlanCard';
import { ResearchStatusCard as ResearchStatusCardRaw } from './ResearchStatusCard';
import { ResourceListCard as ResourceListCardRaw } from './ResourceListCard';
import { ContentCard as ContentCardRaw } from './ContentCard';

// Export loading card (no error handling wrapper needed)
export { ResearchLoadingCard } from './ResearchLoadingCard';

// Wrap all cards with error handling to gracefully handle undefined/null data
export const SearchResultsCard = withCardErrorHandling(SearchResultsCardRaw, 'Search Results');
export const ResearchPlanCard = withCardErrorHandling(ResearchPlanCardRaw, 'Research Plan');
export const ResearchStatusCard = withCardErrorHandling(ResearchStatusCardRaw, 'Research Status');
export const ResourceListCard = withCardErrorHandling(ResourceListCardRaw, 'Resource List');
export const ContentCard = withCardErrorHandling(ContentCardRaw, 'Content');

// Export raw components for advanced usage
export {
  SearchResultsCardRaw,
  ResearchPlanCardRaw,
  ResearchStatusCardRaw,
  ResourceListCardRaw,
  ContentCardRaw,
};

// Export the wrapper for custom components
export { withCardErrorHandling };


