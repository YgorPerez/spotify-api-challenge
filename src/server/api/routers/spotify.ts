import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import {
  AlbumSchema,
  ArtistSchema,
  SimplifiedAlbumSchema,
  SimplifiedTrackSchema,
  TrackSchema,
} from '../../../schema/spotifyApiSchema'
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
      const { body: album } = await ctx.session.spotifyApi.getAlbum(
        input.albumId,
      )
      const tracksResponse = await ctx.session.spotifyApi.getAlbumTracks(
        input.albumId,
      )
      const validatedAlbum = AlbumSchema.safeParse(album)
      const validatedTracks = z
        .array(SimplifiedTrackSchema)
        .safeParse(tracksResponse.body.items)
      if (!validatedAlbum.success) {
        throw new TRPCError({
          message: 'returned type from spotify web api get album not valid',
          code: 'INTERNAL_SERVER_ERROR',
          cause: validatedAlbum?.error,
        })
      }
      if (!validatedTracks.success) {
        throw new TRPCError({
          message:
            'returned type from spotify web api get album tracks not valid',
          code: 'INTERNAL_SERVER_ERROR',
          cause: validatedTracks?.error,
        })
      }
      return { album: validatedAlbum.data, tracks: validatedTracks.data }
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
      const { body: artist } = await ctx.session.spotifyApi.getArtist(
        input.artistId,
      )
      const albumsResponse = await ctx.session.spotifyApi.getArtistAlbums(
        input.artistId,
      )
      const validatedArtist = ArtistSchema.safeParse(artist)
      const validatedAlbums = z
        .array(SimplifiedAlbumSchema)
        .safeParse(albumsResponse.body.items)
      if (!validatedArtist.success) {
        throw new TRPCError({
          message: 'returned type from spotify web api get artist not valid',
          code: 'INTERNAL_SERVER_ERROR',
          cause: validatedArtist?.error,
        })
      }
      if (!validatedAlbums.success) {
        throw new TRPCError({
          message:
            'returned type from spotify web api get artist albums not valid',
          code: 'INTERNAL_SERVER_ERROR',
          cause: validatedAlbums?.error,
        })
      }
      return { artist: validatedArtist.data, albums: validatedAlbums.data }
    }),
  getTrack: protectedTokenProcedure
    .meta({ description: 'Gets a track using an id' })
    .input(
      z.object({
        trackId: z.string().describe('The id to get the track.'),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { body: track } = await ctx.session.spotifyApi.getTrack(
        input.trackId,
      )
      const validatedTrack = TrackSchema.safeParse(track)
      if (validatedTrack.success) {
        return { track: validatedTrack.data }
      } else {
        throw new TRPCError({
          message: 'returned type from spotify web api get track not valid',
          code: 'INTERNAL_SERVER_ERROR',
          cause: validatedTrack.error,
        })
      }
    }),
  getSearchTracks: protectedTokenProcedure
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
      const searchTracksResponse = await ctx.session.spotifyApi.searchTracks(
        input.searchTerm,
        {
          include_external: input.includeExternalAudio ? 'audio' : undefined,
          limit: input.amount || 20,
        },
      )
      const searchAlbumsResponse = await ctx.session.spotifyApi.searchAlbums(
        input.searchTerm,
        {
          limit: input.amount || 20,
        },
      )
      const searchArtistsResponse = await ctx.session.spotifyApi.searchArtists(
        input.searchTerm,
        {
          limit: input.amount || 20,
        },
      )
      const validatedSearchContent = z
        .object({
          tracks: z.array(TrackSchema).optional(),
          albums: z.array(SimplifiedAlbumSchema).optional(),
          artists: z.array(ArtistSchema).optional(),
        })
        .optional()
        .safeParse({
          tracks: searchTracksResponse?.body?.['tracks']?.items,
          albums: searchAlbumsResponse?.body?.['albums']?.items,
          artists: searchArtistsResponse?.body?.['artists']?.items,
        })
      if (validatedSearchContent.success) {
        return {
          tracks: validatedSearchContent.data?.tracks,
          albums: validatedSearchContent.data?.albums,
          artists: validatedSearchContent.data?.artists,
        }
      } else {
        throw new TRPCError({
          message: 'returned type from spotify web api get search not valid',
          code: 'INTERNAL_SERVER_ERROR',
          cause: validatedSearchContent.error,
        })
      }
    }),
})
