import { type RequestLike } from '@clerk/nextjs/dist/types/server/types'
import type {
  SignedInAuthObject,
  SignedOutAuthObject,
} from '@clerk/nextjs/server'
import { getAuth } from '@clerk/nextjs/server'
import { initTRPC, type inferAsyncReturnType } from '@trpc/server'
import { type AxiomRequest } from 'next-axiom'
import type { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { type TRPCPanelMeta } from 'trpc-panel'
import transformer from 'trpc-transformer'
import { ZodError } from 'zod'

interface AuthContext {
  auth: SignedInAuthObject | SignedOutAuthObject
  req: RequestLike | AxiomRequest
  resHeaders?: NextResponse['headers']
  event?: NextFetchEvent | undefined
}

export const createInnerTRPCContext = ({
  auth,
  req,
  resHeaders,
  event,
}: AuthContext) => {
  return {
    auth,
    req,
    resHeaders,
    event,
  }
}

export function createTRPCContext({
  req,
  resHeaders,
  event,
}: {
  req: NextRequest | AxiomRequest
  resHeaders: NextResponse['headers']
  event?: NextFetchEvent | undefined
}) {
  return createInnerTRPCContext({ req, resHeaders, auth: getAuth(req), event })
}

type TRPCContext = inferAsyncReturnType<typeof createTRPCContext>

export const t = initTRPC
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

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
