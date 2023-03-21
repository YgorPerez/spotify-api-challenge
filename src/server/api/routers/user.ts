import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
	getUserId: protectedProcedure.meta({ description: "" }).query(({ ctx }) => {
		return ctx.session.accessToken;
	}),
});
