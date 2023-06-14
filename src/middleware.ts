import { authMiddleware } from '@clerk/nextjs'
import { TRPCError } from '@trpc/server'
import { ratelimit } from './server/lib/redis-ratelimit'

export default authMiddleware({
  async beforeAuth(request, event) {
    const userIp = request.headers.get('x-forwarded-for')?.split(',')[0]
    if (ratelimit) {
      const { success: successIp, pending: pendingIp } = await ratelimit.limit(
        userIp || '127.0.0.1',
      )
      event.waitUntil(pendingIp)
      if (!successIp) {
        throw new TRPCError({
          message: 'Wait 10s and try again',
          code: 'TOO_MANY_REQUESTS',
        })
      }
    }
    return
  },
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
