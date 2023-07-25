import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { withAxiom, type AxiomRequest } from 'next-axiom';
import { type NextFetchEvent, type NextResponse } from 'next/server';
import { env } from '../../../env.mjs';
import { appRouter } from '../../../server/api/root';
import { createTRPCContext } from '../../../server/api/trpc';

export const config = {
  runtime: 'edge',
};

async function nextApiHandler(
  req: AxiomRequest,
  res: NextResponse,
  event: NextFetchEvent,
) {
  return fetchRequestHandler({
    router: appRouter,
    createContext: () =>
      createTRPCContext({ req, resHeaders: res.headers, event }),
    req,
    endpoint: '/api/trpc',
    onError: ({ path, error }) => {
      const formatedError = `❌ tRPC failed on ${path ?? '<no-path>'}: ${
        error.message
      }, cause: ${(error.cause as unknown as string) ?? '<no-path>'}, code: ${
        error.code
      }, stack: ${error.stack ?? '<no-stack>'}`;

      env.NODE_ENV === 'development'
        ? console.error(formatedError)
        : req.log.error(formatedError);
    },
  });
}

function handler(req: AxiomRequest, res: NextResponse, event: NextFetchEvent) {
  const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
  const MAX_CACHE_TIME = ONE_DAY_IN_SECONDS * 31;
  res?.headers?.set(
    'cache-control',
    `s-maxage=${MAX_CACHE_TIME}, stale-while-revalidate=${MAX_CACHE_TIME}`,
  );
  return nextApiHandler(req, res, event);
}

export default withAxiom(handler);
