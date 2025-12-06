import { logger } from '../utils/logger';

// Use Redis in production, in-memory cache in development
let Redis: any;
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  try {
    Redis = require('ioredis').default || require('ioredis');
  } catch (e) {
    logger.warn('Redis not available in production, falling back to in-memory cache');
  }
}

/**
 * Cache Entry for in-memory storage
 */
interface CacheEntry {
  value: string;
  expiresAt?: number;
}

/**
 * Unified Cache Service
 * - In-memory for local development
 * - Redis for production
 */
class RedisService {
  private store: Map<string, CacheEntry> = new Map();
  private redisClient: any = null;
  private isConnected: boolean = false;
  private cleanupInterval: NodeJS.Timeout | null = null;
  private useRedis: boolean = false;

  constructor() {
    if (isProduction && Redis) {
      this.initializeRedis();
    } else {
      this.initializeInMemory();
    }
  }

  /**
   * Initialize Redis connection (production)
   */
  private initializeRedis(): void {
    try {
      const config = require('../config').config;
      this.redisClient = new Redis({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
        retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });

      this.redisClient.on('connect', () => {
        this.isConnected = true;
        this.useRedis = true;
        logger.info('✅ Connected to Redis (production)');
      });

      this.redisClient.on('error', (error: any) => {
        this.isConnected = false;
        logger.error('❌ Redis connection error:', error.message);
        // Fall back to in-memory cache
        if (!this.useRedis) {
          this.initializeInMemory();
        }
      });

      this.redisClient.on('close', () => {
        this.isConnected = false;
        logger.warn('Redis connection closed');
      });
    } catch (error) {
      logger.warn('Failed to initialize Redis, falling back to in-memory cache');
      this.initializeInMemory();
    }
  }

  /**
   * Initialize in-memory cache (development/fallback)
   */
  private initializeInMemory(): void {
    this.store = new Map();
    this.useRedis = false;
    this.isConnected = true;
    logger.info('✅ Using in-memory cache (development/fallback)');
    // Clean up expired entries every 60 seconds
    if (!this.cleanupInterval) {
      this.cleanupInterval = setInterval(() => this.cleanupExpiredEntries(), 60000);
    }
  }

  /**
   * Clean up expired cache entries
   */
  private cleanupExpiredEntries(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.expiresAt && entry.expiresAt < now) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Set key-value pair with optional expiry (in seconds)
   */
  async set(key: string, value: string, expirySeconds?: number): Promise<void> {
    try {
      if (this.useRedis && this.redisClient) {
        if (expirySeconds) {
          await this.redisClient.setex(key, expirySeconds, value);
        } else {
          await this.redisClient.set(key, value);
        }
      } else {
        const expiresAt = expirySeconds ? Date.now() + expirySeconds * 1000 : undefined;
        this.store.set(key, { value, expiresAt });
      }
    } catch (error) {
      logger.error(`Cache SET error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get value by key
   */
  async get(key: string): Promise<string | null> {
    try {
      if (this.useRedis && this.redisClient) {
        return await this.redisClient.get(key);
      } else {
        const entry = this.store.get(key);
        if (!entry) return null;

        // Check if expired
        if (entry.expiresAt && entry.expiresAt < Date.now()) {
          this.store.delete(key);
          return null;
        }

        return entry.value;
      }
    } catch (error) {
      logger.error(`Cache GET error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Delete key
   */
  async del(key: string): Promise<void> {
    try {
      if (this.useRedis && this.redisClient) {
        await this.redisClient.del(key);
      } else {
        this.store.delete(key);
      }
    } catch (error) {
      logger.error(`Cache DEL error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      if (this.useRedis && this.redisClient) {
        const result = await this.redisClient.exists(key);
        return result === 1;
      } else {
        const entry = this.store.get(key);
        if (!entry) return false;

        // Check if expired
        if (entry.expiresAt && entry.expiresAt < Date.now()) {
          this.store.delete(key);
          return false;
        }

        return true;
      }
    } catch (error) {
      logger.error(`Cache EXISTS error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Set key-value pair as JSON with optional expiry
   */
  async setJSON(key: string, value: any, expirySeconds?: number): Promise<void> {
    const jsonString = JSON.stringify(value);
    await this.set(key, jsonString, expirySeconds);
  }

  /**
   * Get JSON value by key
   */
  async getJSON<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error(`Redis JSON parse error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Increment counter (for rate limiting)
   */
  async increment(key: string, expirySeconds?: number): Promise<number> {
    try {
      if (this.useRedis && this.redisClient) {
        const value = await this.redisClient.incr(key);
        if (expirySeconds && value === 1) {
          await this.redisClient.expire(key, expirySeconds);
        }
        return value;
      } else {
        const entry = this.store.get(key);
        let value = 1;

        if (entry) {
          // Check if expired
          if (entry.expiresAt && entry.expiresAt < Date.now()) {
            value = 1;
          } else {
            value = (parseInt(entry.value) || 0) + 1;
          }
        }

        const expiresAt = expirySeconds ? Date.now() + expirySeconds * 1000 : undefined;
        this.store.set(key, { value: value.toString(), expiresAt });
        return value;
      }
    } catch (error) {
      logger.error(`Cache INCR error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get TTL (time to live) for a key
   */
  async getTTL(key: string): Promise<number> {
    try {
      if (this.useRedis && this.redisClient) {
        return await this.redisClient.ttl(key);
      } else {
        const entry = this.store.get(key);
        if (!entry) return -2; // Key does not exist
        if (!entry.expiresAt) return -1; // Key exists but has no associated expire

        const ttl = Math.ceil((entry.expiresAt - Date.now()) / 1000);
        return ttl > 0 ? ttl : -2;
      }
    } catch (error) {
      logger.error(`Cache TTL error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Set expiry on an existing key
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      if (this.useRedis && this.redisClient) {
        return await this.redisClient.expire(key, seconds) === 1;
      } else {
        const entry = this.store.get(key);
        if (!entry) return false;
        
        entry.expiresAt = Date.now() + seconds * 1000;
        this.store.set(key, entry);
        return true;
      }
    } catch (error) {
      logger.error(`Cache expire error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Store refresh token
   */
  async storeRefreshToken(userId: string, token: string, expirySeconds: number = 604800): Promise<void> {
    const key = `refresh_token:${userId}`;
    await this.set(key, token, expirySeconds);
  }

  /**
   * Verify refresh token
   */
  async verifyRefreshToken(userId: string, token: string): Promise<boolean> {
    const key = `refresh_token:${userId}`;
    const storedToken = await this.get(key);
    return storedToken === token;
  }

  /**
   * Delete refresh token (logout)
   */
  async deleteRefreshToken(userId: string): Promise<void> {
    const key = `refresh_token:${userId}`;
    await this.del(key);
  }

  /**
   * Store OTP with 5 minute expiry
   */
  async storeOTP(identifier: string, otp: string): Promise<void> {
    const key = `otp:${identifier}`;
    await this.set(key, otp, 300); // 5 minutes
  }

  /**
   * Verify OTP
   */
  async verifyOTP(identifier: string, otp: string): Promise<boolean> {
    const key = `otp:${identifier}`;
    const storedOTP = await this.get(key);
    if (storedOTP === otp) {
      await this.del(key); // Delete OTP after successful verification
      return true;
    }
    return false;
  }

  /**
   * Rate limiting check
   */
  async checkRateLimit(identifier: string, maxAttempts: number, windowSeconds: number): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
    const key = `rate_limit:${identifier}`;
    const attempts = await this.increment(key, windowSeconds);
    const ttl = await this.getTTL(key);

    return {
      allowed: attempts <= maxAttempts,
      remaining: Math.max(0, maxAttempts - attempts),
      resetIn: ttl > 0 ? ttl : windowSeconds,
    };
  }

  /**
   * Cache AI response
   */
  async cacheAIResponse(prompt: string, response: string, expirySeconds: number = 3600): Promise<void> {
    const key = `ai_cache:${this.hashString(prompt)}`;
    await this.set(key, response, expirySeconds);
  }

  /**
   * Get cached AI response
   */
  async getCachedAIResponse(prompt: string): Promise<string | null> {
    const key = `ai_cache:${this.hashString(prompt)}`;
    return await this.get(key);
  }

  /**
   * Simple hash function for cache keys
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Close connection
   */
  async close(): Promise<void> {
    if (this.useRedis && this.redisClient) {
      await this.redisClient.quit();
      logger.info('Redis connection closed');
    } else {
      if (this.cleanupInterval) {
        clearInterval(this.cleanupInterval);
      }
      logger.info('In-memory cache cleared');
    }
  }

  /**
   * Check connection status
   */
  isReady(): boolean {
    return this.isConnected;
  }

  /**
   * Get current cache mode
   */
  getCacheMode(): string {
    return this.useRedis ? 'Redis (production)' : 'In-Memory (development)';
  }
}

// Export singleton instance
export const redisService = new RedisService();
