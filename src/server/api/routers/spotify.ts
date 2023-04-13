import { TRPCError } from '@trpc/server'
import type { Artist, Paging, SimplifiedAlbum, Track } from 'spotify-web-api-ts-edge/types/types/SpotifyObjects'
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
  TrackSchema
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
        cursor: z.object({
          albums: z.number().optional(),
          tracks: z.number().optional(),
          artists: z.number().optional(),
        }).optional(),
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
    .output(SearchContentItemsSchema.extend({
      nextCursor: z.object({
        albums: z.number().optional(),
        tracks: z.number().optional(),
        artists: z.number().optional(),
      }).optional()
    }))
    .query(async ({ ctx, input }) => {
      const { cursor, mediaType, limit, searchTerm, includeExternalAudio } = input
      type Promises = [Promise<Paging<SimplifiedAlbum>> | undefined, | Promise<Paging<Track>> | undefined, Promise<Paging<Artist>> | undefined]
      const promises: Promises = [undefined, undefined, undefined]
      if (mediaType?.includes('album') || !mediaType) {
        promises[0] = (ctx.spotifyApi.search.searchAlbums(searchTerm,
          {
            limit: limit || 20,
            offset: cursor?.albums ?? 0
          }
        ))
      }
      if (mediaType?.includes('track') || !mediaType) {
        promises[1] = (ctx.spotifyApi.search.searchTracks(searchTerm,
          {
            limit: limit || 20,
            offset: cursor?.tracks ?? 0,
            include_external: includeExternalAudio ? 'audio' : undefined
          }
        ))
      }
      if (mediaType?.includes('artist') || !mediaType) {
        promises[2] = (ctx.spotifyApi.search.searchArtists(searchTerm,
          {
            limit: limit || 20,
            offset: cursor?.artists ?? 0,
          }
        ))
      }
      const [albumsSearchContent, tracksSearchContent, artistsSearchContent] = await Promise.all(promises)
      const validatedSearchContent =
        SearchContentSchema.safeParse({
          albums: albumsSearchContent,
          tracks: tracksSearchContent,
          artists: artistsSearchContent
        })
      if (!validatedSearchContent.success) {
        throw new TRPCError({
          message: 'returned type from spotify-api.js not valid',
          code: 'INTERNAL_SERVER_ERROR',
          cause: validatedSearchContent.error,
        })
      }
      const data = validatedSearchContent.data

      const albumOffset = Number((new URLSearchParams(data.albums?.next ?? undefined)).get('offset'));
      const trackOffset = Number((new URLSearchParams(data.tracks?.next ?? undefined)).get('offset'));
      const artistOffset = Number((new URLSearchParams(data.artists?.next ?? undefined)).get('offset'));

      const nextCursor = (!albumOffset && !trackOffset && !artistOffset)
        ? undefined
        : {
          albums: albumOffset ?? data.albums?.total,
          tracks: trackOffset ?? data.albums?.total,
          artists: artistOffset ?? data.albums?.total,
        }
      return {
        albums: data.albums?.items,
        tracks: data.tracks?.items,
        artists: data.artists?.items,
        nextCursor
      }
    }),
})
