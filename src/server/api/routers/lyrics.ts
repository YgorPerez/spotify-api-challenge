import { env } from '@/env.mjs';
import { PrivateUserSchema } from '@schema/spotifyApiSchemas';
import { TRPCError } from '@trpc/server';
import getLyrics from 'genius-lyrics-ts';
import { z } from 'zod';
import { createTRPCRouter } from '../trpc';
import { protectedTokenProcedure } from '../trpc-middleware';

export const lyricsRouter = createTRPCRouter({
  getAccessToken: protectedTokenProcedure
    .meta({
      description: 'Gets the spotify access token from the clerk database',
    })
    .output(z.string().describe('The accessToken from the user'))
    .query(({ ctx }) => {
      const accessToken = ctx.spotifyApi.getAccessToken();
      return accessToken;
    }),
  getSongLyrics: protectedTokenProcedure
    .meta({
      description: 'Gets the song lyrics based on the title and artist',
    })
    .input(
      z.object({
        songTitle: z.string().describe('The song title.'),
        artistName: z.string().describe('The artist name.'),
      }),
    )
    .output(z.string().nullable().describe('The lyrics of the song'))
    .query(async ({ input }) => {
      const { artistName, songTitle } = input;

      const options = {
        apiKey: env.GENIUS_ACCESS_TOKEN,
        title: songTitle,
        artist: artistName,
      };

      const lyrics = await getLyrics(options);

      const validatedLyrics = z.string().nullable().safeParse(lyrics);
      if (!validatedLyrics.success) {
        throw new TRPCError({
          message: `Lyrics error on: ${songTitle} from ${artistName}`,
          code: 'INTERNAL_SERVER_ERROR',
        });
      }

      return validatedLyrics.data;
    }),
  getUser: protectedTokenProcedure
    .meta({
      description: 'Gets the current user info from spotify',
    })
    .output(
      PrivateUserSchema.nullable()
        .optional()
        .describe('User info got from spotify'),
    )
    .query(async ({ ctx }) => {
      const user = await ctx.spotifyApi.users.getMe();
      const validatedUser = PrivateUserSchema.safeParse(user);
      if (!validatedUser.success) {
        throw new TRPCError({
          message: `Error retrieving user info`,
          code: 'INTERNAL_SERVER_ERROR',
        });
      }

      return validatedUser.data;
    }),
});
