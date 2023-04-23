import { TRPCError } from '@trpc/server'
import type {
  Artist,
  Paging,
  SimplifiedAlbum,
  Track,
} from 'spotify-web-api-ts-edge/types/types/SpotifyObjects'
import { z } from 'zod'
import {
  AlbumSchema,
  ArtistSchema,
  PagingSimplifiedAlbumsSchema,
  PagingSimplifiedTracksSchema,
  SearchContentItemsSchema,
  SearchContentSchema,
  SimplifiedAlbumSchema,
  SimplifiedTrackSchema,
  TrackSchema,
} from '../../../schema/spotifyApiSchemas'
import { createTRPCRouter, protectedTokenProcedure } from '../trpc'

export const spotifyRouter = createTRPCRouter({
  getAlbum: protectedTokenProcedure
    .meta({
      description: "Gets the album and it's tracks using the id of an album",
    })
    .input(
      z.object({
        albumId: z.string().describe('The id to get the album.'),
      }),
    )
    .output(
      z.object({
        album: z
          .union([AlbumSchema, SimplifiedAlbumSchema])
          .describe('the album data retrieved from the id'),
      }),
    )
    .query(async ({ ctx, input }) => {
      const album = await ctx.spotifyApi.albums.getAlbum(input.albumId)
      const validatedAlbum = AlbumSchema.safeParse(album)
      if (!validatedAlbum.success) {
        throw new TRPCError({
          message: 'returned type from spotify-api.js get album not valid',
          code: 'INTERNAL_SERVER_ERROR',
          cause: validatedAlbum?.error,
        })
      }
      return { album: validatedAlbum.data }
    }),
  getAlbumTracks: protectedTokenProcedure
    .meta({
      description: "Gets the album's tracks using the id of an album",
    })
    .input(
      z.object({
        albumId: z.string().describe("The id to get the album's tracks."),
        limit: z.number().optional().describe('The amount of tracks to get'),
        cursor: z.number().optional().describe('The offset to get the tracks'),
      }),
    )
    .output(
      z.object({
        tracks: SimplifiedTrackSchema.array().describe(
          'The tracks data retrieved from the album id',
        ),
        nextCursor: z
          .number()
          .optional()
          .describe(
            'The next offset that should be used for fetching again if using infite query',
          ),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { cursor, albumId, limit } = input
      const tracks = await ctx.spotifyApi.albums.getAlbumTracks(albumId, {
        offset: cursor ?? 0,
        limit: limit || 20,
      })
      if (!tracks) {
        throw new TRPCError({
          message: "didn't find the tracks",
          code: 'NOT_FOUND',
        })
      }
      const validatedTracks = PagingSimplifiedTracksSchema.safeParse(tracks)
      if (!validatedTracks.success) {
        throw new TRPCError({
          message:
            'returned type from spotify-api.js  get album tracks not valid',
          code: 'INTERNAL_SERVER_ERROR',
          cause: validatedTracks?.error,
        })
      }
      const { data } = validatedTracks
      const tracksOffset = Number(
        new URLSearchParams(data?.next ?? undefined).get('offset'),
      )
      return {
        tracks: validatedTracks.data?.items,
        nextCursor: tracksOffset || undefined,
      }
    }),
  getArtist: protectedTokenProcedure
    .meta({
      description: 'Gets the artist with the artistId',
    })
    .input(
      z.object({
        artistId: z.string().describe('The id to get the artist.'),
      }),
    )
    .output(
      z.object({
        artist: ArtistSchema.describe(
          'The artist data retrieved from the artistId',
        ),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { artistId } = input
      const artist = await ctx.spotifyApi.artists.getArtist(artistId)
      const validatedArtist = ArtistSchema.safeParse(artist)
      if (!validatedArtist.success) {
        throw new TRPCError({
          message: 'returned type from spotify-api.js get artist not valid',
          code: 'INTERNAL_SERVER_ERROR',
          cause: validatedArtist?.error,
        })
      }
      return { artist: validatedArtist.data }
    }),
  getArtistAlbums: protectedTokenProcedure
    .meta({
      description: 'Gets the artist albums using the artist id',
    })
    .input(
      z.object({
        artistId: z
          .string()
          .describe("The artist id to get the artist's albums from"),
        limit: z.number().optional().describe('The amount of albums to get'),
        cursor: z.number().optional().describe('The offset to get the albums'),
      }),
    )
    .output(
      z.object({
        albums: z
          .array(SimplifiedAlbumSchema)
          .describe("The artist's albums data retrieved from the artistId"),
        nextCursor: z
          .number()
          .optional()
          .describe(
            'The next offset that should be used for fetching again if using infite query',
          ),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { cursor, artistId, limit } = input
      const albums = await ctx.spotifyApi.artists.getArtistAlbums(artistId, {
        offset: cursor ?? 0,
        limit: limit || 20,
      })
      const validatedAlbums = PagingSimplifiedAlbumsSchema.safeParse(albums)
      if (!validatedAlbums.success) {
        throw new TRPCError({
          message:
            'returned type from spotify-api.js  get artist albums not valid',
          code: 'INTERNAL_SERVER_ERROR',
          cause: validatedAlbums?.error,
        })
      }
      const { data } = validatedAlbums
      const albumOffset = Number(
        new URLSearchParams(data?.next ?? undefined).get('offset'),
      )
      return { albums: data?.items, NextCursor: albumOffset || undefined }
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
        cursor: z
          .object({
            albums: z.number().optional(),
            tracks: z.number().optional(),
            artists: z.number().optional(),
          })
          .optional(),
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
        limit: z
          .number()
          .min(5)
          .max(100)
          .optional()
          .describe('Number of objects to retrieve from each type'),
      }),
    )
    .output(
      SearchContentItemsSchema.extend({
        nextCursor: z
          .object({
            albums: z.number().optional(),
            tracks: z.number().optional(),
            artists: z.number().optional(),
          })
          .optional()
          .describe(
            'The next offset that should be used for fetching again if using infite query',
          ),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { cursor, mediaType, limit, searchTerm, includeExternalAudio } =
        input
      type Promises = [
        Promise<Paging<SimplifiedAlbum>> | undefined,
        Promise<Paging<Track>> | undefined,
        Promise<Paging<Artist>> | undefined,
      ]
      const promises: Promises = [undefined, undefined, undefined]
      if (
        mediaType?.includes('album') ||
        (!mediaType && (cursor ? Boolean(cursor.albums) : true))
      ) {
        promises[0] = ctx.spotifyApi.search.searchAlbums(searchTerm, {
          limit: limit || 20,
          offset: cursor?.albums ?? 0,
        })
      }
      if (
        mediaType?.includes('track') ||
        (!mediaType && (cursor ? Boolean(cursor.tracks) : true))
      ) {
        promises[1] = ctx.spotifyApi.search.searchTracks(searchTerm, {
          limit: limit || 20,
          offset: cursor?.tracks ?? 0,
          include_external: includeExternalAudio ? 'audio' : undefined,
        })
      }
      if (
        mediaType?.includes('artist') ||
        (!mediaType && (cursor ? Boolean(cursor.artists) : true))
      ) {
        promises[2] = ctx.spotifyApi.search.searchArtists(searchTerm, {
          limit: limit || 20,
          offset: cursor?.artists ?? 0,
        })
      }
      const [albumsSearchContent, tracksSearchContent, artistsSearchContent] =
        await Promise.all(promises)
      const validatedSearchContent = SearchContentSchema.safeParse({
        albums: albumsSearchContent,
        tracks: tracksSearchContent,
        artists: artistsSearchContent,
      })
      if (!validatedSearchContent.success) {
        throw new TRPCError({
          message: 'returned type from spotify-api.js not valid',
          code: 'INTERNAL_SERVER_ERROR',
          cause: validatedSearchContent.error,
        })
      }
      const data = validatedSearchContent.data

      const albumOffset =
        Number(
          new URLSearchParams(data.albums?.next ?? undefined).get('offset'),
        ) || undefined
      const trackOffset =
        Number(
          new URLSearchParams(data.tracks?.next ?? undefined).get('offset'),
        ) || undefined
      const artistOffset =
        Number(
          new URLSearchParams(data.artists?.next ?? undefined).get('offset'),
        ) || undefined

      const nextCursor =
        !albumOffset && !trackOffset && !artistOffset
          ? undefined
          : {
              albums: albumOffset,
              tracks: trackOffset,
              artists: artistOffset,
            }
      return {
        albums: data.albums?.items,
        tracks: data.tracks?.items,
        artists: data.artists?.items,
        nextCursor,
      }
    }),
})
