import { createServerSideHelpers } from '@trpc/react-query/server';
import type { GetServerSidePropsContext } from 'next';
import transformer from 'trpc-transformer';
import { appRouter } from '../server/api/root';
import { createInnerTRPCContext } from '../server/api/trpc';

export const ssrHelper = (context: GetServerSidePropsContext) => {
  const forwarded = context.req.headers['x-forwarded-for'] as string;
  const ip = forwarded ? forwarded.split(/, /)[0] : '127.0.0.1';
  return createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({
      req: context.req,
      ip,
    }),
    transformer,
  });
};
