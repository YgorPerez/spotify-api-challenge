import { getAuth } from '@clerk/nextjs/server'
import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import type { GetServerSidePropsContext } from 'next'
import { appRouter } from '../server/api/root'
import { createInnerTRPCContext } from '../server/api/trpc'
import { transformer } from './transformer'

export const generateSSGHelper = (context: GetServerSidePropsContext) => {
  const auth = getAuth(context.req)
  return createProxySSGHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({
      req: context.req,
      auth,
    }),
    transformer,
  })
}
