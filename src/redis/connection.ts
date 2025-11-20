import Redis from 'ioredis'

import env from '@/env'

export const redis = new Redis({ lazyConnect: true })

export async function connectRedis() {
  try {
    redis.options.host = env.REDIS_HOST
    redis.options.port = env.REDIS_PORT
    redis.options.password = env.REDIS_PASSWORD
    await redis.connect()
  }
  catch (error) {
    console.error('❌ Failed to connect to Redis:', error)
    process.exit(1)
  }
}
