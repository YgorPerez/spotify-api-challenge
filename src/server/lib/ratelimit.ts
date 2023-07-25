import { TRPCError } from '@trpc/server';
import { Ratelimit } from '@upstash/ratelimit';
import { type NextFetchEvent } from 'next/server';
import { env } from '../../env.mjs';
import { redis } from './redis';

const rateLimitCache = new Map();

const ratelimiter = async ({
  userId,
  event,
}: {
  userId?: string;
  event?: NextFetchEvent;
}) => {
  if (env.NODE_ENV === 'production' && event && userId) {
    const ratelimit = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(50, '10 s'),
      timeout: 1000, // 1 second
      analytics: true,
      ephemeralCache: rateLimitCache,
    });
    const { success, pending } = await ratelimit.limit(userId);
    event.waitUntil(pending);
    if (!success) {
      throw new TRPCError({
        message: 'Wait 10s and try again',
        code: 'TOO_MANY_REQUESTS',
      });
    }
  }
};

export default ratelimiter
