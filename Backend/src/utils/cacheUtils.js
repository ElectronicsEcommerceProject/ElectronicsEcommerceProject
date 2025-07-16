import redisClient from "../config/redis.js";

// Cache configuration
const CACHE_CONFIG = {
  DEFAULT_TTL: 3600, // 1 hour in seconds
  SHORT_TTL: 900,    // 15 minutes
  LONG_TTL: 7200,    // 2 hours
};

// Cache utility functions
export const cacheUtils = {
  // Get data from cache
  async get(key) {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  },

  // Set data in cache with TTL
  async set(key, data, ttl = CACHE_CONFIG.DEFAULT_TTL) {
    try {
      await redisClient.setEx(key, ttl, JSON.stringify(data));
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
    }
  },

  // Clear cache patterns
  async clearPatterns(...patterns) {
    try {
      for (const pattern of patterns) {
        await redisClient.del(pattern);
      }
    } catch (error) {
      console.error(`Cache clear error for patterns ${patterns}:`, error);
    }
  }
};

export const CACHE_TTL = CACHE_CONFIG;