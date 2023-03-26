import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { env } from '../../env.mjs'

const rateLimitCache = new Map()

const ratelimiter = () => {
  if (env.NODE_ENV === 'production') {
    return new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(50, '10 s'),
      timeout: 1000, // 1 second
      analytics: true,
      ephemeralCache: rateLimitCache,
    })
  }
}

export const ratelimit = ratelimiter()
