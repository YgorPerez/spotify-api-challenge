import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import type { GetServerSidePropsContext } from 'next'
import { appRouter } from '../server/api/root'
import { createInnerTRPCContext } from '../server/api/trpc'
import { getServerAuthSession } from '../server/lib/auth'
import { transformer } from './transformer'

export const generateSSGHelper = async (context: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(context)
  return createProxySSGHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({
      session: session,
    }),
    transformer,
  })
}
