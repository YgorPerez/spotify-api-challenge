import { createNextApiHandler } from '@trpc/server/adapters/next'
import type { NextApiResponse } from 'next'
import { AxiomAPIRequest, withAxiom } from 'next-axiom'
import { env } from '../../../env.mjs'
import { appRouter } from '../../../server/api/root'
import { createTRPCContext } from '../../../server/api/trpc'

// export API handler
const nextApiHandler = createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === 'development'
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? '<no-path>'}: ${
              error.message
            }, cause: ${error.cause}`,
          )
        }
      : undefined,
})

async function handler(req: AxiomAPIRequest, res: NextApiResponse) {
  return nextApiHandler(req, res)
}

export default withAxiom(handler)
