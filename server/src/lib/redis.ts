import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,

  retryStrategy(times) {
    if (times > 20) {
        return null; 
    }

    const delay = Math.min(Math.pow(2, times) * 50, 2000);

    const jitter = Math.floor(Math.random() * 100);
    
    return delay + jitter;
  },

  keepAlive: 10000, 
  connectTimeout: 10000,

  reconnectOnError(err) {
    const targetErrors = ['READONLY', 'ETIMEDOUT'];
    if (targetErrors.some(target => err.message.includes(target))) {
      return 2; 
    }
    return false; 
  },
});

redis.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

redis.on('connect', () => {
    console.log('Redis Client Connected');
});


const CACHE_V = 'v1';

export const CacheKeys = {
  search: {
    base: (type: string, query: string, limit: number, offset: number) => 
      `${CACHE_V}:search:${type}:${query.trim().toLowerCase()}:l_${limit}:o_${offset}`,
    
    autosuggest: (query: string) => 
      `${CACHE_V}:search:suggest:${query.trim().toLowerCase()}`,
    
    trending: () => `${CACHE_V}:search:trending`,
    
    recent: (userId?: string) => 
      userId ? `${CACHE_V}:search:recent:u_${userId}` : `${CACHE_V}:search:recent:anon`,
  },

  entity: {
    story: (id: string) => `${CACHE_V}:story:${id}`,
    user: (id: string) => `${CACHE_V}:user:${id}`,
    section: (id: string) => `${CACHE_V}:section:${id}`,
  },

  stats: {
    dashboard: () => `${CACHE_V}:stats:dashboard`,
    story: (storyId: string) => `${CACHE_V}:stats:story:${storyId}`,
  }
} as const;

export const CACHE_TTL = {
  SHORT: 60,            
  MEDIUM: 3600,         
  LONG: 86400,          
  STATS: 300,           
} as const;



export const CacheUtils = {
  async invalidateSearch() {
    const pattern = "v1:search:*";
    const stream = redis.scanStream({ match: pattern, count: 100 });
    let count = 0;

    for await (const keys of stream) {
      if (keys.length > 0) {
        await redis.unlink(...keys);
        count += keys.length;
      }
    }
    console.log(`Non-blocking invalidate: ${count} search keys removed.`);
  },

  async invalidateEntity(type: "story" | "user" | "section", id: string, shouldFlushSearch = false) {
    const key = CacheKeys.entity[type](id);
    await redis.unlink(key);

    if (shouldFlushSearch) {
      await this.invalidateSearch();
    }
  },

  async clearCurrentVersion() {
    const stream = redis.scanStream({ match: "v1:*", count: 100 });
    for await (const keys of stream) {
      if (keys.length > 0) await redis.unlink(...keys);
    }
    console.log("App v1 cache cleared safely.");
  },

  async getStats() {
    const [dbSize, memory] = await Promise.all([
      redis.dbsize(),
      redis.info("memory")
    ]);
    
    return {
      totalKeys: dbSize,
      usedMemory: memory.split("\r\n").find(l => l.startsWith("used_memory_human"))?.split(":")[1]
    };
  }
};


const pendingRequests = new Map<string, Promise<any>>();

export async function cacheAside<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>
): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached) as T;
  } catch (err) {
    console.error(`[Redis Error] Get key ${key}:`, err);
  }

  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  const fetchPromise = fetcher().finally(() => {
    pendingRequests.delete(key); 
  });

  pendingRequests.set(key, fetchPromise);

  const data = await fetchPromise;
  const jitter = Math.floor(Math.random() * (ttl * 0.1)) - (ttl * 0.05);
  const finalTtl = Math.max(1, ttl + jitter);

  try {
    if (data !== undefined && data !== null) {
      await redis.setex(key, finalTtl, JSON.stringify(data));
    }
  } catch (err) {
    console.error(`[Redis Error] Set key ${key}:`, err);
  }

  return data;
}
