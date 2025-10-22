/**
 * Type definitions for Web3 Research tools
 * 
 * Comprehensive types adapted from the original Web3 Research MCP
 */

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

export interface ResearchLog {
  timestamp: string;
  message: string;
}

export interface ResearchPlan {
  [key: string]: {
    description: string;
    sources: string[];
    status: "planned" | "in_progress" | "completed";
  };
}

export interface ResearchData {
  tokenName: string;
  tokenTicker: string;
  researchPlan: ResearchPlan;
  searchResults: Record<string, any>;
  technicalData: Record<string, any>;
  marketData: Record<string, any>;
  socialData: Record<string, any>;
  newsData: Array<{
    title: string;
    url: string;
    excerpt?: string;
    date?: string;
    source?: string;
  }>;
  teamData: Record<string, any>;
  relatedTokens: Array<any>;
  resources: Record<
    string,
    {
      url: string;
      format: string;
      content: string;
      title?: string;
      source?: string;
      fetchedAt: string;
    }
  >;
  researchData: Record<string, any>;
  status: "not_started" | "in_progress" | "completed";
  logs: ResearchLog[];
  createdAt: string;
  updatedAt: string;
}

export interface ResearchStatus {
  tokenName: string;
  tokenTicker: string;
  status: string;
  progress: Record<string, string>;
}

export interface ResourceInfo {
  id: string;
  url: string;
  title?: string;
  source?: string;
  contentLength: number;
  fetchedAt: string;
}

export interface ResearchSession {
  id: string;
  tokenName: string;
  tokenTicker: string;
  status: string;
  createdAt: string;
}

// Tool-specific response types
export interface SearchToolResponse {
  success: boolean;
  data?: {
    query: string;
    searchType: string;
    results: SearchResult[];
    timestamp: number;
    researchId?: string;
  };
  error?: string;
  config?: {
    duckduckgo: boolean;
    tavily: boolean;
    serper: boolean;
    hasAnyKey: boolean;
  };
}

export interface ResearchPlanToolResponse {
  success: boolean;
  data?: {
    researchId: string;
    tokenName: string;
    tokenTicker: string;
    plan: ResearchPlan;
    createdAt: number;
    status: string;
  };
  error?: string;
}

export interface ResearchTokenToolResponse {
  success: boolean;
  data?: {
    researchId: string;
    tokenName: string;
    tokenTicker: string;
    keywordResults: Record<string, SearchResult[]>;
    keywords: string[];
    status: ResearchStatus;
    timestamp: number;
  };
  error?: string;
}

export interface KeywordResearchToolResponse {
  success: boolean;
  data?: {
    tokenName: string;
    tokenTicker: string;
    keywords: string[];
    results: Record<string, SearchResult[]>;
    researchId: string;
    timestamp: number;
  };
  error?: string;
}

export interface StatusUpdateToolResponse {
  success: boolean;
  data?: {
    researchId: string;
    section: string;
    status: string;
    timestamp: number;
  };
  error?: string;
}

export interface FetchContentToolResponse {
  success: boolean;
  data?: {
    url: string;
    format: string;
    content: FetchContentResponse;
    researchId?: string;
    timestamp: number;
  };
  error?: string;
}

export interface SearchSourceToolResponse {
  success: boolean;
  data?: {
    tokenName: string;
    tokenTicker: string;
    source: string;
    results: SearchResult[];
    researchId: string;
    timestamp: number;
  };
  error?: string;
}

export interface ListResourcesToolResponse {
  success: boolean;
  data?: {
    researchId: string;
    resources: ResourceInfo[];
    timestamp: number;
  };
  error?: string;
}

export interface ResearchStatusToolResponse {
  success: boolean;
  data?: {
    researchId: string;
    status: ResearchStatus;
    logs: ResearchLog[];
    timestamp: number;
  };
  error?: string;
}

export interface CompleteResearchToolResponse {
  success: boolean;
  data?: {
    researchId: string;
    status: string;
    timestamp: number;
  };
  error?: string;
}

export interface ListSessionsToolResponse {
  success: boolean;
  data?: {
    sessions: ResearchSession[];
    timestamp: number;
  };
  error?: string;
}
