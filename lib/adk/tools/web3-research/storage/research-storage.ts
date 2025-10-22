/**
 * Redis-based Research Storage Service
 * 
 * Provides persistent storage for Web3 research data using Redis.
 * Falls back to in-memory storage if Redis is not configured.
 */

import { Redis } from 'ioredis';

// Types from the original MCP
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

let redisClient: Redis | null = null;

/**
 * Get or create Redis client
 */
function getRedisClient(): Redis | null {
  if (!process.env.REDIS_URL) {
    console.warn('[ResearchStorage] REDIS_URL not configured, using in-memory storage');
    return null;
  }

  if (!redisClient) {
    try {
      redisClient = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) {
            console.error('[ResearchStorage] Max retries reached, giving up');
            return null;
          }
          return Math.min(times * 100, 3000);
        },
        reconnectOnError: (err) => {
          console.warn('[ResearchStorage] Reconnecting after error:', err.message);
          return true;
        },
      });

      redisClient.on('connect', () => {
        console.log('[ResearchStorage] Redis connected successfully');
      });

      redisClient.on('error', (err) => {
        console.error('[ResearchStorage] Redis error:', err);
      });
    } catch (error) {
      console.error('[ResearchStorage] Failed to create Redis client:', error);
      return null;
    }
  }

  return redisClient;
}

/**
 * Redis-based Research Storage
 */
export class ResearchStorage {
  private redis: Redis | null;
  private inMemoryStorage: Map<string, ResearchData> = new Map();
  private currentResearchId: string | null = null;

  constructor() {
    this.redis = getRedisClient();
  }

  /**
   * Start new research session
   */
  async startNewResearch(tokenName: string, tokenTicker: string): Promise<string> {
    const researchId = `${tokenName.toLowerCase()}_${tokenTicker.toLowerCase()}_${Date.now()}`;
    
    const researchData: ResearchData = {
      tokenName,
      tokenTicker,
      researchPlan: {},
      searchResults: {},
      technicalData: {},
      marketData: {},
      socialData: {},
      newsData: [],
      teamData: {},
      relatedTokens: [],
      resources: {},
      researchData: {},
      status: "in_progress",
      logs: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.currentResearchId = researchId;
    await this.saveResearch(researchId, researchData);
    await this.addLogEntry(researchId, `Started research on ${tokenName} (${tokenTicker})`);
    
    return researchId;
  }

  /**
   * Get current research data
   */
  async getCurrentResearch(): Promise<ResearchData | null> {
    if (!this.currentResearchId) {
      return null;
    }
    return this.getResearch(this.currentResearchId);
  }

  /**
   * Get research by ID
   */
  async getResearch(researchId: string): Promise<ResearchData | null> {
    if (this.redis) {
      try {
        const key = `research:${researchId}`;
        const data = await this.redis.get(key);
        return data ? JSON.parse(data) : null;
      } catch (error) {
        console.error('[ResearchStorage] Failed to get research from Redis:', error);
        return this.inMemoryStorage.get(researchId) || null;
      }
    }
    
    return this.inMemoryStorage.get(researchId) || null;
  }

  /**
   * Save research data
   */
  async saveResearch(researchId: string, data: ResearchData): Promise<void> {
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    if (this.redis) {
      try {
        const key = `research:${researchId}`;
        const ttl = 7 * 24 * 60 * 60; // 7 days
        await this.redis.setex(key, ttl, JSON.stringify(updatedData));
      } catch (error) {
        console.error('[ResearchStorage] Failed to save research to Redis:', error);
        this.inMemoryStorage.set(researchId, updatedData);
      }
    } else {
      this.inMemoryStorage.set(researchId, updatedData);
    }
  }

  /**
   * Update research section
   */
  async updateSection<K extends keyof ResearchData>(
    researchId: string,
    section: K,
    data: ResearchData[K]
  ): Promise<void> {
    const research = await this.getResearch(researchId);
    if (!research) {
      throw new Error(`Research not found: ${researchId}`);
    }

    research[section] = data;
    await this.saveResearch(researchId, research);
    await this.addLogEntry(researchId, `Updated section: ${section as string}`);
  }

  /**
   * Add data to research section
   */
  async addToSection<K extends keyof ResearchData>(
    researchId: string,
    section: K,
    data: Partial<ResearchData[K]> | any
  ): Promise<void> {
    const research = await this.getResearch(researchId);
    if (!research) {
      throw new Error(`Research not found: ${researchId}`);
    }

    const currentSection = research[section];

    if (Array.isArray(currentSection)) {
      (research[section] as any[]).push(data);
    } else if (typeof currentSection === "object" && currentSection !== null) {
      research[section] = {
        ...(currentSection as object),
        ...(data as object),
      } as ResearchData[K];
    } else {
      throw new Error(`Section ${section as string} has unsupported type`);
    }

    await this.saveResearch(researchId, research);
    await this.addLogEntry(researchId, `Added item to section: ${section as string}`);
  }

  /**
   * Get resource by ID
   */
  async getResource(researchId: string, resourceId: string): Promise<any> {
    const research = await this.getResearch(researchId);
    if (!research) {
      return null;
    }
    return research.resources[resourceId] || null;
  }

  /**
   * Get all resources for research
   */
  async getAllResources(researchId: string): Promise<Record<string, any>> {
    const research = await this.getResearch(researchId);
    if (!research) {
      return {};
    }
    return research.resources;
  }

  /**
   * Add resource to research
   */
  async addResource(
    researchId: string,
    resourceId: string,
    resource: {
      url: string;
      format: string;
      content: string;
      title?: string;
      source?: string;
      fetchedAt: string;
    }
  ): Promise<void> {
    const research = await this.getResearch(researchId);
    if (!research) {
      throw new Error(`Research not found: ${researchId}`);
    }

    research.resources[resourceId] = resource;
    await this.saveResearch(researchId, research);
    await this.addLogEntry(researchId, `Added resource: ${resourceId}`);
  }

  /**
   * Add log entry
   */
  async addLogEntry(researchId: string, message: string): Promise<void> {
    const research = await this.getResearch(researchId);
    if (!research) {
      throw new Error(`Research not found: ${researchId}`);
    }

    const logEntry: ResearchLog = {
      timestamp: new Date().toISOString(),
      message,
    };

    research.logs.push(logEntry);
    await this.saveResearch(researchId, research);
  }

  /**
   * Complete research
   */
  async completeResearch(researchId: string): Promise<void> {
    const research = await this.getResearch(researchId);
    if (!research) {
      throw new Error(`Research not found: ${researchId}`);
    }

    research.status = "completed";
    await this.saveResearch(researchId, research);
    await this.addLogEntry(researchId, `Completed research on ${research.tokenName}`);
  }

  /**
   * List all research sessions
   */
  async listResearchSessions(): Promise<Array<{ id: string; tokenName: string; tokenTicker: string; status: string; createdAt: string }>> {
    if (this.redis) {
      try {
        const pattern = 'research:*';
        const keys = await this.redis.keys(pattern);
        
        const sessions = await Promise.all(
          keys.map(async (key: string) => {
            const researchId = key.replace('research:', '');
            const data = await this.getResearch(researchId);
            if (data) {
              return {
                id: researchId,
                tokenName: data.tokenName,
                tokenTicker: data.tokenTicker,
                status: data.status,
                createdAt: data.createdAt,
              };
            }
            return null;
          })
        );
        
        return sessions.filter(s => s !== null) as Array<{ id: string; tokenName: string; tokenTicker: string; status: string; createdAt: string }>;
      } catch (error) {
        console.error('[ResearchStorage] Failed to list research sessions:', error);
        return [];
      }
    }
    
    // Fallback to in-memory
    return Array.from(this.inMemoryStorage.entries()).map(([id, data]) => ({
      id,
      tokenName: data.tokenName,
      tokenTicker: data.tokenTicker,
      status: data.status,
      createdAt: data.createdAt,
    }));
  }

  /**
   * Delete research session
   */
  async deleteResearch(researchId: string): Promise<void> {
    if (this.redis) {
      try {
        const key = `research:${researchId}`;
        await this.redis.del(key);
      } catch (error) {
        console.error('[ResearchStorage] Failed to delete research from Redis:', error);
      }
    }
    
    this.inMemoryStorage.delete(researchId);
    
    if (this.currentResearchId === researchId) {
      this.currentResearchId = null;
    }
  }

  /**
   * Set current research ID
   */
  setCurrentResearch(researchId: string): void {
    this.currentResearchId = researchId;
  }

  /**
   * Get current research ID
   */
  getCurrentResearchId(): string | null {
    return this.currentResearchId;
  }
}

// Singleton instance
let researchStorageInstance: ResearchStorage | null = null;

export function getResearchStorage(): ResearchStorage {
  if (!researchStorageInstance) {
    researchStorageInstance = new ResearchStorage();
  }
  return researchStorageInstance;
}

export default ResearchStorage;
