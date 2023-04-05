import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { type NextRequest, type NextResponse } from 'next/server'
import { env } from '../../../env.mjs'
import { appRouter } from '../../../server/api/root'
import { createTRPCContext } from '../../../server/api/trpc'
// import { type AxiomAPIRequest, withAxiom } from 'next-axiom'
// import { type NextApiResponse } from 'next'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest, res: NextResponse) {
  return fetchRequestHandler({
    router: appRouter,
    createContext: () => createTRPCContext({ req, resHeaders: res.headers }),
    req,
    endpoint: '/api/trpc',
    onError:
      env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${
                error.message
              }, cause: ${(error.cause as unknown as string) ?? '<no-path>'}`,
            )
          }
        : undefined,
  })
}

// function handler(req: AxiomAPIRequest, res: NextApiResponse) {
//   const ONE_DAY_IN_SECONDS = 60 * 60 * 24
//   const MAX_CACHE_TIME = ONE_DAY_IN_SECONDS * 31
//   res.setHeader(
//     'cache-control',
//     `s-maxage=${MAX_CACHE_TIME}, stale-while-revalidate=${MAX_CACHE_TIME}`,
//   )
//   return nextApiHandler(nextReq)
// }

// export default withAxiom(handler)
