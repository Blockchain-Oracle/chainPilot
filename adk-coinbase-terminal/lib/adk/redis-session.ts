/**
 * Redis Session Service for ADK
 *
 * This file provides Redis-based session management for the ADK agent.
 * Falls back to in-memory session if Redis is not configured.
 */

import { BaseSessionService } from "@iqai/adk";
import Redis from "ioredis";

/**
 * Session configuration options
 */
export interface SessionConfig {
  ttl?: number; // Time to live in seconds
  prefix?: string; // Key prefix for Redis keys
}

/**
 * Default session configuration
 */
export const DEFAULT_SESSION_CONFIG: SessionConfig = {
  ttl: 86400, // 24 hours
  prefix: "adk:session:",
};

/**
 * Redis-based session service implementation
 */
export class RedisSessionService extends BaseSessionService {
  private redis: Redis;
  private config: Required<SessionConfig>;

  constructor(redisUrl: string, config: SessionConfig = {}) {
    super();
    this.config = { ...DEFAULT_SESSION_CONFIG, ...config } as Required<SessionConfig>;
    this.redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      lazyConnect: true,
    });

    // Handle Redis connection events
    this.redis.on("error", (error) => {
      console.error("Redis connection error:", error);
    });

    this.redis.on("connect", () => {
      console.log("Redis session service connected");
    });
  }

  /**
   * Create a new session (required by BaseSessionService)
   */
  async createSession(
    agentId: string,
    userId: string,
    initialData: Record<string, any> = {},
    sessionId?: string
  ): Promise<any> {
    const id = sessionId || `${agentId}:${userId}:${Date.now()}`;
    const sessionData = {
      id,
      agentId,
      userId,
      createdAt: new Date().toISOString(),
      ...initialData,
    };
    
    await this.set(id, sessionData);
    return sessionData;
  }

  /**
   * Get session by ID (required by BaseSessionService)
   */
  async getSession(
    agentId: string,
    userId: string,
    sessionId?: string
  ): Promise<any | null> {
    const id = sessionId || `${agentId}:${userId}`;
    return await this.get(id);
  }

  /**
   * List all sessions for a user (required by BaseSessionService)
   */
  async listSessions(agentId: string, userId: string): Promise<{ sessions: any[] }> {
    try {
      const pattern = `${this.config.prefix}${agentId}:${userId}*`;
      const keys = await this.redis.keys(pattern);
      
      const sessions = await Promise.all(
        keys.map(async (key) => {
          const sessionId = key.replace(this.config.prefix, "");
          return await this.get(sessionId);
        })
      );
      
      return {
        sessions: sessions.filter((s) => s !== null)
      };
    } catch (error) {
      console.error("Failed to list sessions:", error);
      return { sessions: [] };
    }
  }

  /**
   * Delete a session (required by BaseSessionService)
   */
  async deleteSession(sessionId: string): Promise<void> {
    await this.delete(sessionId);
  }

  /**
   * Connect to Redis
   */
  async connect(): Promise<void> {
    try {
      await this.redis.connect();
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
      throw error;
    }
  }

  /**
   * Get session data by session ID
   */
  async get(sessionId: string): Promise<Record<string, any> | null> {
    try {
      const key = this.getKey(sessionId);
      const data = await this.redis.get(key);

      if (!data) {
        return null;
      }

      return JSON.parse(data);
    } catch (error) {
      console.error(`Failed to get session ${sessionId}:`, error);
      return null;
    }
  }

  /**
   * Set session data with TTL
   */
  async set(sessionId: string, data: Record<string, any>): Promise<void> {
    try {
      const key = this.getKey(sessionId);
      const serialized = JSON.stringify(data);

      await this.redis.setex(key, this.config.ttl, serialized);
    } catch (error) {
      console.error(`Failed to set session ${sessionId}:`, error);
      throw error;
    }
  }

  /**
   * Update session data (merges with existing data)
   */
  async update(sessionId: string, data: Record<string, any>): Promise<void> {
    try {
      const existing = await this.get(sessionId);
      const merged = { ...existing, ...data };
      await this.set(sessionId, merged);
    } catch (error) {
      console.error(`Failed to update session ${sessionId}:`, error);
      throw error;
    }
  }

  /**
   * Delete session data
   */
  async delete(sessionId: string): Promise<void> {
    try {
      const key = this.getKey(sessionId);
      await this.redis.del(key);
    } catch (error) {
      console.error(`Failed to delete session ${sessionId}:`, error);
      throw error;
    }
  }

  /**
   * Check if session exists
   */
  async exists(sessionId: string): Promise<boolean> {
    try {
      const key = this.getKey(sessionId);
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Failed to check session ${sessionId}:`, error);
      return false;
    }
  }

  /**
   * Refresh session TTL
   */
  async touch(sessionId: string): Promise<void> {
    try {
      const key = this.getKey(sessionId);
      await this.redis.expire(key, this.config.ttl);
    } catch (error) {
      console.error(`Failed to touch session ${sessionId}:`, error);
    }
  }

  /**
   * Get all session IDs (use with caution in production)
   */
  async getAllSessions(): Promise<string[]> {
    try {
      const pattern = `${this.config.prefix}*`;
      const keys = await this.redis.keys(pattern);
      return keys.map((key) => key.replace(this.config.prefix, ""));
    } catch (error) {
      console.error("Failed to get all sessions:", error);
      return [];
    }
  }

  /**
   * Clear all sessions (use with caution!)
   */
  async clearAll(): Promise<void> {
    try {
      const pattern = `${this.config.prefix}*`;
      const keys = await this.redis.keys(pattern);

      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error("Failed to clear all sessions:", error);
      throw error;
    }
  }

  /**
   * Close Redis connection
   */
  async disconnect(): Promise<void> {
    try {
      await this.redis.quit();
      console.log("Redis session service disconnected");
    } catch (error) {
      console.error("Failed to disconnect from Redis:", error);
    }
  }

  /**
   * Get the full Redis key for a session ID
   */
  private getKey(sessionId: string): string {
    return `${this.config.prefix}${sessionId}`;
  }

  /**
   * Get session statistics
   */
  async getStats(): Promise<{
    totalSessions: number;
    memoryUsage: string;
    ttl: number;
  }> {
    try {
      const pattern = `${this.config.prefix}*`;
      const keys = await this.redis.keys(pattern);
      const info = await this.redis.info("memory");
      const memoryMatch = info.match(/used_memory_human:([^\r\n]+)/);

      return {
        totalSessions: keys.length,
        memoryUsage: memoryMatch ? memoryMatch[1] : "unknown",
        ttl: this.config.ttl,
      };
    } catch (error) {
      console.error("Failed to get session stats:", error);
      return {
        totalSessions: 0,
        memoryUsage: "unknown",
        ttl: this.config.ttl,
      };
    }
  }
}

/**
 * Get Redis session service if configured, otherwise returns undefined
 * to use default in-memory session
 */
export function getRedisSessionService(
  config: SessionConfig = {}
): BaseSessionService | undefined {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.log("📦 Redis URL not configured, using in-memory session");
    return undefined;
  }

  try {
    console.log("🔗 Creating Redis session service...");
    const sessionService = new RedisSessionService(redisUrl, config);

    // Connect to Redis asynchronously (don't await here to avoid blocking)
    sessionService.connect().catch((error) => {
      console.error("⚠️  Redis connection failed, falling back to in-memory session:", error);
    });

    console.log("✅ Redis session service created successfully");
    return sessionService;
  } catch (error) {
    console.error("❌ Failed to create Redis session service:", error);
    console.log("📦 Falling back to in-memory session");
    return undefined;
  }
}

/**
 * Create a Redis session service with custom configuration
 */
export function createRedisSessionService(
  redisUrl: string,
  config: SessionConfig = {}
): RedisSessionService {
  return new RedisSessionService(redisUrl, config);
}
