import { getAuth } from '@clerk/nextjs/server'
import { createServerSideHelpers } from '@trpc/react-query/server'
import type { GetServerSidePropsContext } from 'next'
import transformer from 'trpc-transformer'
import { appRouter } from '../server/api/root'
import { createInnerTRPCContext } from '../server/api/trpc'

export const ssrHelper = (context: GetServerSidePropsContext) => {
  const auth = getAuth(context.req)
  return createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({
      req: context.req,
      auth,
    }),
    transformer,
  })
}
