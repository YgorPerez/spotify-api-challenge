import { lyricsRouter } from './routers/lyrics'
import { spotifyRouter } from './routers/spotify'
import { createTRPCRouter } from './trpc'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  spotify: spotifyRouter,
  lyrics: lyricsRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
