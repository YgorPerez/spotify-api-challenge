import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUserAccessToken: protectedProcedure
    .meta({ description: "get user accessToken by id" })
    .query(async ({ ctx }) => {
      return await ctx.prisma.account.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
      });
    }),
  hello: publicProcedure
    .meta({ description: "Returns hello + your text" })
    .input(
      z.object({
        text: z.string().describe("The name to say hello too."),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getSecretMessage: protectedProcedure
    .meta({ description: "Shows a message if the user is logged in" })
    .query(() => {
      return "you can now see this secret message!";
    }),
});
