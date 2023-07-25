import { initTRPC, type inferAsyncReturnType } from '@trpc/server';
import { type IncomingMessage } from 'http';
import { type AxiomRequest } from 'next-axiom';
import { type NextApiRequestCookies } from 'next/dist/server/api-utils';
import type { NextFetchEvent, NextResponse } from 'next/server';
import { type TRPCPanelMeta } from 'trpc-panel';
import transformer from 'trpc-transformer';
import { ZodError } from 'zod';

interface AuthContext {
  req:
    | (IncomingMessage & {
        cookies: NextApiRequestCookies;
      })
    | AxiomRequest;
  resHeaders?: NextResponse['headers'];
  ip?: string;
  event?: NextFetchEvent | undefined;
}

export const createInnerTRPCContext = ({
  req,
  resHeaders,
  event,
  ip,
}: AuthContext) => {
  return {
    req,
    resHeaders,
    event,
    ip,
  };
};

export function createTRPCContext({
  req,
  resHeaders,
  event,
  ip,
}: {
  req:
    | (IncomingMessage & {
        cookies: NextApiRequestCookies;
      })
    | AxiomRequest;
  resHeaders: NextResponse['headers'];
  ip?: string;
  event?: NextFetchEvent | undefined;
}) {
  return createInnerTRPCContext({ req, resHeaders, event, ip });
}

type TRPCContext = inferAsyncReturnType<typeof createTRPCContext>;

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
            error.cause instanceof ZodError ? error.cause.flatten() : null,
        },
      };
    },
  });

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
