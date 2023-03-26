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
 * database, the session, etc.
 */
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { type Session, type TokenSet } from 'next-auth'
import { getServerAuthSession } from '../lib/auth'
import { prisma } from '../lib/db'

type CreateContextOptions = {
  session: Session | null
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
export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  }
}

/**
 * This is the actual context you will use in your router. It will be used to
 * process every request that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts

  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerAuthSession({ req, res })

  return createInnerTRPCContext({
    session,
  })
}

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and
 * transformer.
 */
import { initTRPC, TRPCError } from '@trpc/server'
import { type TRPCPanelMeta } from 'trpc-panel'
import { transformer } from '../../utils/transformer'

const t = initTRPC
  .context<typeof createTRPCContext>()
  .meta<TRPCPanelMeta>()
  .create({
    transformer,
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
 * can still access user session data if they are logged in.
 */
export const publicProcedure = t.procedure

/**
 * Reusable middleware that enforces users are logged in before running the
 * procedure.
 */
import type { Client } from 'spotify-api.js'
import { ZodError } from 'zod'
import { AccountFindFirstSchema } from '../../../prisma/generated/schema/schemas'
import { env } from '../../env.mjs'
import { ratelimit } from '../lib/redis-ratelimit'
import { globalForSpotifyClient, spotifyClient } from '../lib/spotify-api'

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({
      message: 'you need to be logged in first',
      code: 'UNAUTHORIZED',
    })
  }
  if (ratelimit) {
    const { success } = await ratelimit.limit(ctx.session.user.id)
    if (!success) {
      throw new TRPCError({
        message: 'Wait 10s and try again',
        code: 'TOO_MANY_REQUESTS',
      })
    }
  }
  return next({
    ctx: {
      ...ctx,
      // infers the `session` as non-nullable
      session: {
        ...ctx.session,
        user: ctx.session.user,
      },
    },
  })
})

const IsAccessTokenValid = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({
      message: 'you need to be logged in first',
      code: 'UNAUTHORIZED',
    })
  }
  const userId = ctx.session.user.id

  if (ratelimit) {
    const { success } = await ratelimit.limit(userId)
    if (!success) {
      throw new TRPCError({
        message: 'Wait 10s and try again',
        code: 'TOO_MANY_REQUESTS',
      })
    }
  }

  const userAccount = await ctx.prisma.account.findFirst({
    where: {
      userId,
    },
  })
  AccountFindFirstSchema.parse(userAccount)

  if (!userAccount) {
    throw new TRPCError({
      message: `User account not found id: ${userId}`,
      code: 'INTERNAL_SERVER_ERROR',
    })
  }

  let accessToken: string | null | undefined = userAccount.access_token
  let refreshToken: string | undefined =
    (env.SPOTIFY_REFRESH_TOKEN as string) ?? userAccount.refresh_token
  let client: Client | null = null
  const clientId = env.SPOTIFY_CLIENT_ID
  const clientSecret = env.SPOTIFY_CLIENT_SECRET
  const redirectUrl = env.NEXTAUTH_URL

  if (accessToken) {
    client = spotifyClient(
      accessToken,
      clientId,
      clientSecret,
      refreshToken,
      redirectUrl,
    )
    const ACCESS_TOKEN_EXPIRES_IN_S = 3600
    const accessTokenExpiresAt =
      Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRES_IN_S
    console.log('accessTokenExpiresAt', accessTokenExpiresAt)
    const tokenExpired =
      (userAccount.expires_at as number) < accessTokenExpiresAt
    if (tokenExpired) {
      try {
        const spotifyTokenApiUrl = 'https://accounts.spotify.com/api/token?'
        const spotifyTokenResponse = await fetch(spotifyTokenApiUrl, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: process.env.SPOTIFY_CLIENT_ID as string,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET as string,
            grant_type: 'refresh_token',
            refresh_token:
              (process.env.SPOTIFY_REFRESH_TOKEN as string) ??
              userAccount.refresh_token,
          }),
          method: 'POST',
        })

        /* eslint-disable @typescript-eslint/no-unsafe-assignment */
        const tokens: TokenSet = await spotifyTokenResponse.json()

        if (!spotifyTokenResponse.ok) throw tokens
        if (!tokens?.access_token) throw tokens.access_token
        accessToken = tokens.access_token
        await ctx.prisma.account.update({
          data: {
            access_token: tokens.access_token,
            expires_at: accessTokenExpiresAt,
            refresh_token: tokens.refresh_token ?? userAccount.refresh_token,
          },
          where: {
            provider_providerAccountId: {
              provider: 'spotify',
              providerAccountId: userAccount.providerAccountId as string,
            },
          },
        })
      } catch (error) {
        throw new TRPCError({
          message: `Error refreshing access token`,
          code: 'INTERNAL_SERVER_ERROR',
          cause: error,
        })
      }
    }
    if (!accessToken) {
      throw new TRPCError({
        message: `Access token does not exist`,
        code: 'INTERNAL_SERVER_ERROR',
      })
    }
  }
  if (!client) {
    client = spotifyClient(
      env.SPOTIFY_REFRESH_TOKEN as string,
      clientId,
      clientSecret,
      refreshToken,
      redirectUrl,
    )
  }
  globalForSpotifyClient.spotifyClient = client

  return next({
    ctx: {
      ...ctx,
      // infers the `session` as non-nullable
      session: {
        ...ctx.session,
        user: {
          ...ctx.session.user,
        },
        spotifyClient: client,
      },
    },
  })
})

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use
 * this. It verifies the session is valid and guarantees `ctx.session.user` is
 * not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
export const protectedTokenProcedure = t.procedure.use(IsAccessTokenValid)
