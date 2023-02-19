import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUserId: protectedProcedure.query(({ ctx }) => {
    return ctx.session.accessToken;
  }),
});
