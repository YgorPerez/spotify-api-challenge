import { createTRPCRouter } from "./trpc";
import { spotifyRouter } from "./routers/spotify";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  spotify: spotifyRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
