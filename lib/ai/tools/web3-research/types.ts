/**
 * TypeScript type definitions for Web3 Research MCP
 * Based on web3-research-mcp implementation
 */

// ============================================
// Research Plan Types
// ============================================

export type ResearchPhaseStatus = 'planned' | 'in_progress' | 'completed';

export interface ResearchPhase {
  description: string;
  sources: string[];
  status: ResearchPhaseStatus;
}

export interface ResearchPlan {
  [phaseName: string]: ResearchPhase;
}

// ============================================
// Search Types
// ============================================

export type SearchType = 'web' | 'news' | 'images' | 'videos';

export interface SearchRequest {
  query: string;
  searchType?: SearchType;
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  displayUrl?: string;
  thumbnail?: string;
  publishedDate?: string;
  source?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
  searchType: SearchType;
  timestamp: number;
}

// ============================================
// Research Source Types
// ============================================

export type ResearchSource =
  | 'dune'
  | 'iqwiki'
  | 'coingecko'
  | 'defillama'
  | 'github'
  | 'twitter'
  | 'medium'
  | 'discord'
  | 'telegram'
  | 'reddit'
  | 'docs'
  | 'web';

export interface SearchSourceRequest {
  source: ResearchSource;
  query: string;
}

export interface SourceSearchResult {
  source: ResearchSource;
  results: SearchResult[];
  metadata?: {
    totalResults?: number;
    searchTime?: number;
    relevanceScore?: number;
  };
}

// ============================================
// Content Fetching Types
// ============================================

export interface FetchContentRequest {
  url: string;
}

export interface ContentMetadata {
  title?: string;
  description?: string;
  author?: string;
  publishedDate?: string;
  keywords?: string[];
  image?: string;
  siteName?: string;
}

export interface FetchContentResponse {
  title: string;
  content: string;
  metadata: ContentMetadata;
  url: string;
  timestamp: number;
}

// ============================================
// Token Research Types
// ============================================

export interface CreateResearchPlanRequest {
  tokenName: string;
  tokenTicker: string;
}

export interface ResearchWithKeywordsRequest {
  tokenName: string;
  tokenTicker: string;
  keywords: string[];
}

export interface ResearchTokenRequest {
  tokenName: string;
  tokenTicker: string;
  sources?: ResearchSource[];
}

export interface UpdateStatusRequest {
  tokenName: string;
  tokenTicker: string;
  phaseName: string;
  status: ResearchPhaseStatus;
}

export interface ListResourcesRequest {
  tokenName: string;
  tokenTicker: string;
}

// ============================================
// Research Data Types
// ============================================

export interface ResearchData {
  tokenName: string;
  tokenTicker: string;
  researchPlan: ResearchPlan;
  searchResults: Record<string, SearchResult[]>;
  contentCache: Record<string, FetchContentResponse>;
  sources: {
    [source in ResearchSource]?: SourceSearchResult;
  };
  keywords?: string[];
  createdAt: number;
  updatedAt: number;
  status: 'initializing' | 'in_progress' | 'completed';
}

export interface ResearchResource {
  title: string;
  url: string;
  type: 'article' | 'documentation' | 'social' | 'data' | 'code' | 'other';
  source: ResearchSource;
  relevanceScore?: number;
  summary?: string;
  timestamp: number;
}

export interface ListResourcesResponse {
  tokenName: string;
  tokenTicker: string;
  resources: ResearchResource[];
  totalCount: number;
  bySource: Record<ResearchSource, number>;
  byType: Record<string, number>;
}

// ============================================
// Research Analysis Types
// ============================================

export interface TokenMetrics {
  price?: number;
  marketCap?: number;
  volume24h?: number;
  priceChange24h?: number;
  circulatingSupply?: number;
  totalSupply?: number;
  holders?: number;
  transactions24h?: number;
}

export interface SocialMetrics {
  twitter?: {
    followers: number;
    engagement: number;
    lastTweetDate?: string;
  };
  discord?: {
    members: number;
    onlineMembers?: number;
  };
  telegram?: {
    members: number;
  };
  reddit?: {
    subscribers: number;
    activeUsers?: number;
  };
  github?: {
    stars: number;
    forks: number;
    lastCommit?: string;
  };
}

export interface ResearchSummary {
  tokenName: string;
  tokenTicker: string;
  overview: string;
  metrics?: TokenMetrics;
  socialMetrics?: SocialMetrics;
  keyFindings: string[];
  strengths: string[];
  risks: string[];
  sentiment: 'bullish' | 'neutral' | 'bearish';
  confidenceScore: number;
  sources: string[];
  generatedAt: number;
}

// ============================================
// Tool Response Types
// ============================================

export interface ToolResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: number;
    duration?: number;
    version?: string;
  };
}

// Specific tool responses
export type SearchToolResponse = ToolResponse<SearchResponse>;
export type CreateResearchPlanResponse = ToolResponse<ResearchPlan>;
export type FetchContentToolResponse = ToolResponse<FetchContentResponse>;
export type SearchSourceResponse = ToolResponse<SourceSearchResult>;
export type ResearchTokenResponse = ToolResponse<ResearchData>;
export type ListResourcesToolResponse = ToolResponse<ListResourcesResponse>;
export type UpdateStatusResponse = ToolResponse<ResearchPlan>;

// ============================================
// Keyword Analysis Types
// ============================================

export interface KeywordAnalysis {
  keyword: string;
  searchVolume?: number;
  relevance: number;
  results: SearchResult[];
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface KeywordResearchResponse {
  tokenName: string;
  tokenTicker: string;
  keywords: KeywordAnalysis[];
  summary: string;
  timestamp: number;
}
