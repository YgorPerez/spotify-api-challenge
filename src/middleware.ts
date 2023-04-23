import { getAuth, withClerkMiddleware } from '@clerk/nextjs/server'
import { TRPCError } from '@trpc/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { ratelimit } from './server/lib/redis-ratelimit'

// Set the paths that don't require the user to be signed in
const publicPaths = ['/', '/auth*']

const isPublic = (path: string) => {
  return publicPaths.find(x =>
    path.match(new RegExp(`^${x}$`.replace('*$', '($|/)'))),
  )
}

export default withClerkMiddleware(
  async (request: NextRequest, event: NextFetchEvent) => {
    const response = NextResponse.next()
    const ONE_DAY_IN_SECONDS = 60 * 60 * 24
    const MAX_CACHE_TIME = ONE_DAY_IN_SECONDS * 31

    response.headers.set('x-modified-edge', 'true')
    response.headers.set(
      'cache-control',
      `s-maxage=${MAX_CACHE_TIME}, stale-while-revalidate=${MAX_CACHE_TIME}`,
    )

    if (isPublic(request.nextUrl.pathname)) {
      return NextResponse.next()
    }
    // if the user is not signed in redirect them to the sign in page.
    const { userId } = getAuth(request)
    if (!userId) {
      const signInUrl = new URL('/auth/sign-in', request.url)
      signInUrl.searchParams.set('redirect_url', request.url)
      return NextResponse.redirect(signInUrl)
    }

    const userIp = request.headers.get('x-forwarded-for')?.split(',')[0]
    if (ratelimit) {
      const { success, pending } = await ratelimit.limit(userId)
      const { success: successIp, pending: pendingIp } = await ratelimit.limit(
        userIp || '127.0.0.1',
      )
      event.waitUntil(pending)
      event.waitUntil(pendingIp)
      if (!success || !successIp) {
        throw new TRPCError({
          message: 'Wait 10s and try again',
          code: 'TOO_MANY_REQUESTS',
        })
      }
    }

    return NextResponse.next()
  },
)

export const config = {
  matcher: '/((?!_next/image|_next/static|favicon.ico).*)',
}
