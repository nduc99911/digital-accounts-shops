import { Redis } from 'ioredis'

let redis: Redis | null = null

try {
  redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    retryStrategy: () => null, // Don't retry
    maxRetriesPerRequest: 0,
  })
  
  redis.on('error', () => {
    redis = null
  })
} catch {
  redis = null
}

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    if (!redis) return null
    try {
      const data = await redis.get(key)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  },

  async set(key: string, value: any, ttlSeconds = 3600): Promise<void> {
    if (!redis) return
    try {
      await redis.setex(key, ttlSeconds, JSON.stringify(value))
    } catch {
      // Fail silently - cache is best effort
    }
  },

  async del(key: string): Promise<void> {
    if (!redis) return
    try {
      await redis.del(key)
    } catch {
      // Fail silently
    }
  },

  async delPattern(pattern: string): Promise<void> {
    if (!redis) return
    try {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
    } catch {
      // Fail silently
    }
  },
}

// Cache keys helpers
export const cacheKeys = {
  product: (slug: string) => `product:${slug}`,
  products: (filter: string) => `products:${filter}`,
  categories: () => 'categories:all',
  category: (slug: string) => `category:${slug}`,
  search: (query: string) => `search:${query}`,
  homepage: () => 'homepage:data',
}
