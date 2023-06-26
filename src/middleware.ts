import { authMiddleware } from '@clerk/nextjs'
import { ratelimiter } from './server/lib/redis-ratelimit'

export default authMiddleware({
  async beforeAuth(request, event) {
    const userIp = request.headers.get('x-forwarded-for')?.split(',')[0]
    await ratelimiter({ userId: userIp || '127.0.0.1', event })
  },
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
