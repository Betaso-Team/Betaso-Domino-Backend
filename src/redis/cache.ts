import type Redis from 'ioredis'

export class TypedCache {
  private redis: Redis
  constructor(redis: Redis) {
    this.redis = redis
  }

  async setCache<T>(data: T, cachePrefix: string[]): Promise<boolean> {
    const ok = await this.redis.set(
      `${[...cachePrefix].join(':')}`,
      JSON.stringify(data),
    )
    return ok === 'OK'
  }

  async setCacheWithTTL<T>(
    data: T,
    cachePrefix: string[],
    ttl?: number,
  ): Promise<boolean> {
    const key = cachePrefix.join(':')
    let ok: string
    if (typeof ttl === 'number' && ttl > 0) {
      ok = await this.redis.set(key, JSON.stringify(data), 'EX', ttl)
    }
    else {
      ok = await this.redis.set(key, JSON.stringify(data))
    }
    return ok === 'OK'
  }

  async getCache<T>(cachePrefix: string[]): Promise<T> {
    const data = await this.redis.get(`${[...cachePrefix].join(':')}`)
    return JSON.parse(data ?? '{}') as T
  }

  async deleteCache(cachePrefix: string[]): Promise<void> {
    await this.redis.del(`${[...cachePrefix].join(':')}`)
  }

  async zaddCache(
    cachePrefix: string[],
    score: number,
    username: string,
  ): Promise<number> {
    return await this.redis.zadd(
      `${[...cachePrefix].join(':')}`,
      score,
      username,
    )
  }

  async zaddIncrement(
    cachePrefix: string[],
    score: number,
    username: string,
  ): Promise<string> {
    return await this.redis.zincrby(
      `${[...cachePrefix].join(':')}`,
      score,
      username,
    )
  }

  async zrangeReverse(
    cachePrefix: string[],
    start: number,
    stop: number,
  ): Promise<string[]> {
    return await this.redis.zrevrange(
      `${[...cachePrefix].join(':')}`,
      0,
      stop,
      'WITHSCORES',
    )
  }

  async zrange(
    cachePrefix: string[],
    start: number,
    stop: number,
  ): Promise<string[]> {
    return await this.redis.zrange(
      `${[...cachePrefix].join(':')}`,
      0,
      stop,
      'WITHSCORES',
    )
  }

  async zrevrank(
    cachePrefix: string[],
    username: string,
  ): Promise<number | null> {
    return await this.redis.zrevrank(`${[...cachePrefix].join(':')}`, username)
  }

  async zscore(
    cachePrefix: string[],
    username: string,
  ): Promise<string | null> {
    return await this.redis.zscore(`${[...cachePrefix].join(':')}`, username)
  }

  async deleteAllCache(cachePrefix: string[]): Promise<void> {
    const keys = await this.redis.keys(`${[...cachePrefix].join(':')}:*`)

    if (keys.length > 0) {
      await this.redis.del(...keys)
    }
  }

  async deleteRankingCache(cachePrefix: string[]): Promise<void> {
    const keys = await this.redis.keys(`${[...cachePrefix].join(':')}:*`)
    if (keys.length > 0) {
      await this.redis.del(...keys)
    }
    await this.redis.del(`${[...cachePrefix].join(':')}`)
  }
}
