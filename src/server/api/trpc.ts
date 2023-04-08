/* YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * tl;dr - This is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end.
 */

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the
 * database, the auth, etc.
 */
import type {
  SignedInAuthObject,
  SignedOutAuthObject,
} from '@clerk/nextjs/dist/api'
import { type RequestLike } from '@clerk/nextjs/dist/server/types'
import { getAuth } from '@clerk/nextjs/server'
import { initTRPC, type inferAsyncReturnType } from '@trpc/server'
import type { NextRequest, NextResponse } from 'next/server'
import { type TRPCPanelMeta } from 'trpc-panel'
import { ZodError } from 'zod'
import { transformer } from '../../utils/transformer'
import { type AxiomRequest } from 'next-axiom'

interface AuthContext {
  auth: SignedInAuthObject | SignedOutAuthObject
  req: RequestLike | AxiomRequest
  resHeaders?: NextResponse['headers']
}

/**
 * This helper generates the "internals" for a tRPC context. If you need to use
 * it, you can export it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
export const createInnerTRPCContext = ({
  auth,
  req,
  resHeaders,
}: AuthContext) => {
  return {
    auth,
    req,
    resHeaders,
  }
}

/**
 * This is the actual context you will use in your router. It will be used to
 * process every request that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export function createTRPCContext({
  req,
  resHeaders,
}: {
  req: NextRequest | AxiomRequest
  resHeaders: NextResponse['headers']
}) {
  return createInnerTRPCContext({ req, resHeaders, auth: getAuth(req) })
}

type TRPCContext = inferAsyncReturnType<typeof createTRPCContext>
/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and
 * transformer.
 */

const t = initTRPC
  .context<TRPCContext>()
  .meta<TRPCPanelMeta>()
  .create({
    transformer: transformer,
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError:
            error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
              ? error.cause.flatten()
              : null,
        },
      }
    },
  })

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user auth data if they are logged in.
 */
export const publicProcedure = t.procedure

/**
 * Reusable middleware that enforces users are logged in before running the
 * procedure.
 */

import { TRPCError } from '@trpc/server'
import { env } from '../../env.mjs'
import { UserTokenSchema } from '../../schema/clerkSchemas'
import { ratelimit } from '../lib/redis-ratelimit'
import {
  globalForSpotifyClient,
  spotifyClientOauth,
} from '../lib/spotify-api'

const ratelimiter = async (userId: string) => {
  if (ratelimit) {
    const { success } = await ratelimit.limit(userId)
    if (!success) {
      throw new TRPCError({
        message: 'Wait 10s and try again',
        code: 'TOO_MANY_REQUESTS',
      })
    }
  }
}

const unauthorizedError = () => {
  return new TRPCError({
    message: 'you need to be logged in first',
    code: 'UNAUTHORIZED',
  })
}

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.auth.userId) {
    throw unauthorizedError()
  }

  const userId = ctx.auth.userId
  await ratelimiter(userId)

  return next({
    ctx: {
      ...ctx,
      // infers the `auth` as non-nullable
      auth: {
        ...ctx.auth,
        user: ctx.auth.user,
      },
    },
  })
})

const IsAccessTokenValid = t.middleware(async ({ ctx, next }) => {
  if (!ctx.auth.userId) {
    throw unauthorizedError()
  }
  const userId = ctx.auth.userId
  await ratelimiter(userId)
  let spotifyApi = globalForSpotifyClient.spotifyApi
  if (!globalForSpotifyClient.spotifyApi) {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const userTokenResponse = await fetch(
      `https://api.clerk.dev/v1/users/${userId}/oauth_access_tokens/oauth_spotify`,
      {
        method: 'get',
        headers: new Headers({
          Authorization: `Bearer ${env.CLERK_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
      },
    )
    if (!userTokenResponse.ok) {
      throw new TRPCError({
        message: `Response error on fetch access token from user: ${userId}`,
        code: 'INTERNAL_SERVER_ERROR',
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const userToken = await userTokenResponse.json()

    const validatedUserToken = UserTokenSchema.safeParse(userToken)
    if (!validatedUserToken.success || !validatedUserToken.data[0]?.token) {
      throw new TRPCError({
        message: `User token not found id: ${userId}`,
        code: 'INTERNAL_SERVER_ERROR',
      })
    }

    spotifyApi = spotifyClientOauth(validatedUserToken.data[0]?.token)
  }

  return next({
    ctx: {
      ...ctx,
      // infers the `auth` as non-nullable
      auth: {
        ...ctx.auth,
        user: {
          ...ctx.auth?.user,
        },
      },
      spotifyApi: spotifyApi,
    }
  })
})

export const protectedTokenProcedure = t.procedure.use(IsAccessTokenValid)
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
