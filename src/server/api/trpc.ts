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
import { initTRPC, type inferAsyncReturnType } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { type Session } from 'next-auth'
import { type TRPCPanelMeta } from 'trpc-panel'
import { ZodError } from 'zod'
import { transformer } from '../../utils/transformer'
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
 * can still access user session data if they are logged in.
 */
export const publicProcedure = t.procedure

/**
 * Reusable middleware that enforces users are logged in before running the
 * procedure.
 */

import { TRPCError } from '@trpc/server'
import { type Client } from 'spotify-api.js'
import { AccountFindFirstSchema } from '../../../prisma/generated/schema/schemas'
import { ratelimit } from '../lib/redis-ratelimit'
import { globalForSpotifyClient, spotifyClient } from '../lib/spotify-api'

function isUserAuthed(ctx: TRPCContext) {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({
      message: 'you need to be logged in first',
      code: 'UNAUTHORIZED',
    })
  }
}

async function ratelimiter(ctx: TRPCContext) {
  if (ratelimit) {
    const { success } = await ratelimit.limit(ctx.session?.user?.id as string)
    if (!success) {
      throw new TRPCError({
        message: 'Wait 10s and try again',
        code: 'TOO_MANY_REQUESTS',
      })
    }
  }
}

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  isUserAuthed(ctx)
  ratelimiter(ctx)

  return next({
    ctx: {
      ...ctx,
      // infers the `session` as non-nullable
      session: {
        ...ctx.session,
        user: ctx.session?.user,
      },
    },
  })
})

const IsAccessTokenValid = t.middleware(async ({ ctx, next }) => {
  isUserAuthed(ctx)
  ratelimiter(ctx)
  const userId = ctx.session?.user?.id
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

  let client: Client
  let accessToken: string | null | undefined = userAccount.access_token

  if (accessToken) {
    client = spotifyClient(userAccount)
  } else {
    client = spotifyClient(userAccount)
  }
  globalForSpotifyClient.spotifyClient = client

  return next({
    ctx: {
      ...ctx,
      // infers the `session` as non-nullable
      session: {
        ...ctx.session,
        user: {
          ...ctx.session?.user,
        },
        spotifyClient: client,
      },
    },
  })
})

export const protectedTokenProcedure = t.procedure.use(IsAccessTokenValid)
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
