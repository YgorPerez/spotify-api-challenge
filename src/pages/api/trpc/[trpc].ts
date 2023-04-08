import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { withAxiom, type AxiomRequest } from 'next-axiom'
import { type NextResponse } from 'next/server'
import { env } from '../../../env.mjs'
import { appRouter } from '../../../server/api/root'
import { createTRPCContext } from '../../../server/api/trpc'

export const config = {
  runtime: 'edge',
}

async function nextApiHandler(req: AxiomRequest, res: NextResponse) {
  return fetchRequestHandler({
    router: appRouter,
    createContext: () => createTRPCContext({ req, resHeaders: res.headers }),
    req,
    endpoint: '/api/trpc',
    onError: ({ path, error }) => {
        env.NODE_ENV === 'development'
        ?
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${
                error.message
              }, cause: ${(error.cause as unknown as string) ?? '<no-path>'}`,
            ) :
            req.log.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${
                error.message
              }, cause: ${(error.cause as unknown as string) ?? '<no-path>'}`)
          }
  })
}

function handler(req: AxiomRequest, res: NextResponse) {
  const ONE_DAY_IN_SECONDS = 60 * 60 * 24
  const MAX_CACHE_TIME = ONE_DAY_IN_SECONDS * 31
  res?.headers?.set(
    'cache-control',
    `s-maxage=${MAX_CACHE_TIME}, stale-while-revalidate=${MAX_CACHE_TIME}`
  )
  return nextApiHandler(req, res)
}

export default withAxiom(handler)
