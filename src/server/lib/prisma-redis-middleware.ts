import type { Prisma } from '@prisma/client'
import { Redis } from 'ioredis'
import { createPrismaRedisCache } from 'prisma-redis-middleware'
import { env } from '../../env.mjs'

const getRedis = () => {
  if (env.NODE_ENV === 'production') {
    return new Redis(env.REDIS_URL)
  }
}

const redis = getRedis()

const SPOTIFY_REFRESH_TOKEN_INVALIDATION_S = 3600

const CacheMiddleware = () => {
  if (redis) {
    return createPrismaRedisCache({
      models: [
        { model: 'User', excludeMethods: ['findMany'] },
        {
          model: 'Account',
        },
      ],
      storage: {
        type: 'redis',
        options: {
          client: redis,
          invalidation: {
            referencesTTL: SPOTIFY_REFRESH_TOKEN_INVALIDATION_S - 1,
          },
          // log: env.NODE_ENV === 'development' ? console.warn() : console.error(),
        },
      },
      cacheTime: SPOTIFY_REFRESH_TOKEN_INVALIDATION_S - 1,
      excludeMethods: ['count', 'groupBy'],
      // onHit: key => {
      //   console.log('hit ', key)
      // },
    })
  }
}

export const cacheMiddleware = CacheMiddleware() as Prisma.Middleware
