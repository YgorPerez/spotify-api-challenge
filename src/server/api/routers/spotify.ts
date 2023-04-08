import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import {
  AlbumSchema,
  ArtistSchema,
  PagingSimplifiedAlbumsSchema,
  PagingSimplifiedTracksSchema,
  SimplifiedAlbumSchema,
  SimplifiedTrackSchema,
  TrackSchema,
  ValidSearchContentSchema,
} from '../../../schema/spotifyApiSchemas'
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
    .output(
      z.object({ album: AlbumSchema, tracks: SimplifiedTrackSchema.array() }),
    )
    .query(async ({ ctx, input }) => {
      const album = await ctx.spotifyApi.albums.getAlbum(input.albumId)
      const tracks = await ctx.spotifyApi.albums.getAlbumTracks(input.albumId)
      const validatedAlbum = AlbumSchema.safeParse(album)
      const validatedTracks = PagingSimplifiedTracksSchema.safeParse(tracks)
      if (!validatedAlbum.success) {
        throw new TRPCError({
          message: 'returned type from spotify-api.js get album not valid',
          code: 'INTERNAL_SERVER_ERROR',
          cause: validatedAlbum?.error,
        })
      }
      if (!validatedTracks.success) {
        throw new TRPCError({
          message:
            'returned type from spotify-api.js  get album tracks not valid',
          code: 'INTERNAL_SERVER_ERROR',
          cause: validatedTracks?.error,
        })
      }
      return { album: validatedAlbum.data, tracks: validatedTracks.data?.items }
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
    .output(
      z.object({
        artist: ArtistSchema,
        albums: z.array(SimplifiedAlbumSchema),
      }),
    )
    .query(async ({ ctx, input }) => {
      const artist = await ctx.spotifyApi.artists.getArtist(input.artistId)
      const albums = await ctx.spotifyApi.artists.getArtistAlbums(input.artistId)
      const validatedArtist = ArtistSchema.safeParse(artist)
      const validatedAlbums = PagingSimplifiedAlbumsSchema.safeParse(albums)
      if (!validatedArtist.success) {
        throw new TRPCError({
          message: 'returned type from spotify-api.js get artist not valid',
          code: 'INTERNAL_SERVER_ERROR',
          cause: validatedArtist?.error,
        })
      }
      if (!validatedAlbums.success) {
        throw new TRPCError({
          message:
            'returned type from spotify-api.js  get artist albums not valid',
          code: 'INTERNAL_SERVER_ERROR',
          cause: validatedAlbums?.error,
        })
      }
      return { artist: validatedArtist.data, albums: validatedAlbums.data?.items }
    }),
  getTrack: protectedTokenProcedure
    .meta({ description: 'Gets a track using an id' })
    .input(
      z.object({
        trackId: z.string().describe('The id to get the track.'),
      }),
    )
    .output(z.object({ track: TrackSchema }))
    .query(async ({ ctx, input }) => {
      const track = await ctx.spotifyApi.tracks.getTrack(input.trackId)
      const validatedTrack = TrackSchema.safeParse(track)
      if (validatedTrack.success) {
        return { track: validatedTrack.data }
      } else {
        throw new TRPCError({
          message: 'returned type from spotify-api.js get track not valid',
          code: 'INTERNAL_SERVER_ERROR',
          cause: validatedTrack.error,
        })
      }
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
    .output(ValidSearchContentSchema)
    .query(async ({ ctx, input }) => {
      const searchContent = await ctx.spotifyApi.search.search(input.searchTerm,
        input.mediaType || ['track', 'album', 'artist'],
        {
          include_external: input.includeExternalAudio ? "audio" : undefined,
          limit: input.amount || 20,
        }
      )
      const validatedSearchContent =
        ValidSearchContentSchema.safeParse({albums: searchContent?.albums?.items, tracks: searchContent?.tracks?.items, artists: searchContent?.artists?.items})
      if (validatedSearchContent.success) {
        return validatedSearchContent.data
      } else {
        throw new TRPCError({
          message: 'returned type from spotify-api.js not valid',
          code: 'INTERNAL_SERVER_ERROR',
          cause: validatedSearchContent.error,
        })
      }
    }),
})
