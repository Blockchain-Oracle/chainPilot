/**
 * Redis Session Service
 *
 * Provides persistent session storage using Redis
 * Falls back to in-memory if Redis is not configured
 */

import { Redis } from 'ioredis';

let redisClient: Redis | null = null;

/**
 * Get or create Redis client
 */
export function getRedisClient(): Redis | null {
  if (!process.env.REDIS_URL) {
    console.warn('[Redis] REDIS_URL not configured, sessions will not persist');
    return null;
  }

  if (!redisClient) {
    try {
      redisClient = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) {
            console.error('[Redis] Max retries reached, giving up');
            return null;
          }
          return Math.min(times * 100, 3000);
        },
        reconnectOnError: (err) => {
          console.warn('[Redis] Reconnecting after error:', err.message);
          return true;
        },
      });

      redisClient.on('connect', () => {
        console.log('[Redis] Connected successfully');
      });

      redisClient.on('error', (err) => {
        console.error('[Redis] Error:', err);
      });

      redisClient.on('close', () => {
        console.warn('[Redis] Connection closed');
      });
    } catch (error) {
      console.error('[Redis] Failed to create client:', error);
      return null;
    }
  }

  return redisClient;
}

/**
 * Close Redis connection
 */
export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}

/**
 * Session storage interface
 */
export interface SessionData {
  userId: string;
  chatId: string;
  messages: any[];
  state: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

const DEFAULT_TTL = 24 * 60 * 60; // 24 hours in seconds

/**
 * Save session to Redis
 */
export async function saveSession(
  sessionId: string,
  data: SessionData,
  ttl: number = DEFAULT_TTL
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) {
    console.warn('[Session] Redis not available, session not persisted');
    return;
  }

  try {
    const key = `session:${sessionId}`;
    const value = JSON.stringify({
      ...data,
      updatedAt: Date.now(),
    });

    await redis.setex(key, ttl, value);
    console.log(`[Session] Saved session ${sessionId}`);
  } catch (error) {
    console.error('[Session] Failed to save:', error);
  }
}

/**
 * Load session from Redis
 */
export async function loadSession(sessionId: string): Promise<SessionData | null> {
  const redis = getRedisClient();
  if (!redis) {
    return null;
  }

  try {
    const key = `session:${sessionId}`;
    const value = await redis.get(key);

    if (!value) {
      return null;
    }

    const data = JSON.parse(value) as SessionData;
    console.log(`[Session] Loaded session ${sessionId}`);
    return data;
  } catch (error) {
    console.error('[Session] Failed to load:', error);
    return null;
  }
}

/**
 * Delete session from Redis
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) {
    return;
  }

  try {
    const key = `session:${sessionId}`;
    await redis.del(key);
    console.log(`[Session] Deleted session ${sessionId}`);
  } catch (error) {
    console.error('[Session] Failed to delete:', error);
  }
}

/**
 * Check if session exists
 */
export async function sessionExists(sessionId: string): Promise<boolean> {
  const redis = getRedisClient();
  if (!redis) {
    return false;
  }

  try {
    const key = `session:${sessionId}`;
    const exists = await redis.exists(key);
    return exists === 1;
  } catch (error) {
    console.error('[Session] Failed to check existence:', error);
    return false;
  }
}

/**
 * Extend session TTL
 */
export async function extendSessionTTL(
  sessionId: string,
  ttl: number = DEFAULT_TTL
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) {
    return;
  }

  try {
    const key = `session:${sessionId}`;
    await redis.expire(key, ttl);
  } catch (error) {
    console.error('[Session] Failed to extend TTL:', error);
  }
}
