import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { SearchContentSchema } from '../../../schema/spotifyApiSchema'
import { createTRPCRouter, protectedTokenProcedure } from '../trpc'

export const spotifyRouter = createTRPCRouter({
  getAlbumTracks: protectedTokenProcedure
    .meta({
      description: "Gets the album and it's tracks using the id of an album",
    })
    .input(
      z.object({
        albumId: z.string().describe('The id to get the album.'),
      }),
    )
    .query(async ({ ctx, input }) => {
      const album = await ctx.session.spotifyClient.albums.get(input.albumId)
      const tracks = await ctx.session.spotifyClient.albums.getTracks(
        input.albumId,
      )
      return { album, tracks }
    }),
  getArtistAlbums: protectedTokenProcedure
    .meta({
      description: "Gets the artist and it's albums using the id of an album",
    })
    .input(
      z.object({
        artistId: z.string().describe('The id to get the artist.'),
      }),
    )
    .query(async ({ ctx, input }) => {
      const artist = await ctx.session.spotifyClient.artists.get(input.artistId)
      const albums = await ctx.session.spotifyClient.artists.getAlbums(
        input.artistId,
      )
      return { artist, albums }
    }),
  getTrack: protectedTokenProcedure
    .meta({ description: 'Gets a track using an id' })
    .input(
      z.object({
        trackId: z.string().describe('The id to get the track.'),
      }),
    )
    .query(async ({ ctx, input }) => {
      const track = await ctx.session.spotifyClient.tracks.get(input.trackId)
      return track
    }),
  getSearch: protectedTokenProcedure
    .meta({
      description:
        'Gets the search results for the specified media types based on text',
    })
    .input(
      z.object({
        searchTerm: z
          .string()
          .min(1)
          .max(30)
          .describe('The text to be searched.'),
        mediaType: z
          .array(z.enum(['track', 'album', 'artist']))
          .min(1)
          .max(3)
          .optional()
          .describe('The media type to be retrieved from search.'),
        includeExternalAudio: z
          .boolean()
          .optional()
          .describe('Includes the url with the audio if true'),
        amount: z
          .number()
          .min(5)
          .max(100)
          .optional()
          .describe('Number of objects to retrieve from each type'),
      }),
    )
    .query(async ({ ctx, input }) => {
      const searchContent = await ctx.session.spotifyClient.search(
        input.searchTerm,
        {
          types: input.mediaType || ['track', 'album', 'artist'],
          includeExternalAudio: input.includeExternalAudio || false,
          limit: input.amount || 20,
        },
      )
      const validatedData = SearchContentSchema.safeParse(searchContent)
      if (validatedData.success) {
        return validatedData.data
      } else {
        throw new TRPCError({
          message: 'returned type from spotify-api.js not valid',
          code: 'INTERNAL_SERVER_ERROR',
          cause: validatedData.error,
        })
      }
    }),
})
