import type {
  PagingArtistsType,
  PagingSimplifiedAlbumsType,
  PagingTracksType,
} from '@schema/spotifyApiSchemas';
import {
  AlbumSchema,
  ArtistSchema,
  PagingSimplifiedAlbumsSchema,
  PagingSimplifiedTracksSchema,
  PrivateUserSchema,
  SearchContentItemsSchema,
  SearchContentSchema,
  SimplifiedAlbumSchema,
  SimplifiedTrackSchema,
  TrackSchema,
} from '@schema/spotifyApiSchemas';
import {
  TRPCError,
  type inferRouterInputs,
  type inferRouterOutputs,
} from '@trpc/server';
import getLyrics from 'genius-lyrics-ts';
import { z } from 'zod';
import { createTRPCRouter } from '../trpc';
import { protectedTokenProcedure } from '../trpc-middleware';

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
      const album = await ctx.spotifyApi.albums.getAlbum(input.albumId);
      const validatedAlbum = SimplifiedAlbumSchema.safeParse(album);
      if (!validatedAlbum.success) {
        throw new TRPCError({
          message:
            'returned type from spotify-web-api-ts-edge get album not valid',
          code: 'INTERNAL_SERVER_ERROR',
          cause: validatedAlbum?.error,
        });
      }
      return { album: validatedAlbum.data };
    }),
  getAlbumTracks: protectedTokenProcedure
    .meta({
      description: "Gets the album's tracks using the id of an album",
    })
    .input(
      z.object({
        albumId: z.string().describe("The id to get the album's tracks."),
        limit: z.number().optional().describe('The amount of tracks to get'),
        cursor: z
          .number()
          .optional()
          .nullable()
          .describe('The offset to get the tracks'),
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
          .nullable()
          .describe(
            'The next offset that should be used for fetching again if using infite query',
          ),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { cursor, albumId, limit } = input;
      const tracks = await ctx.spotifyApi.albums.getAlbumTracks(albumId, {
        offset: cursor ?? 0,
        limit: limit || 15,
      });
      if (!tracks) {
        throw new TRPCError({
          message: "didn't find the tracks",
          code: 'NOT_FOUND',
        });
      }
      const validatedTracks = PagingSimplifiedTracksSchema.safeParse(tracks);
      if (!validatedTracks.success) {
        throw new TRPCError({
          message:
            'returned type from spotify-web-api-ts-edge  get album tracks not valid',
          code: 'INTERNAL_SERVER_ERROR',
          cause: validatedTracks?.error,
        });
      }
      const { data } = validatedTracks;
      const nextUrl = data?.next && new URL(data.next);
      const trackOffset =
        Number(
          new URLSearchParams((nextUrl?.search as string) || undefined).get(
            'offset',
          ),
        ) || undefined;
      return {
        tracks: validatedTracks.data?.items,
        nextCursor: trackOffset,
      };
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
      const { artistId } = input;
      const artist = await ctx.spotifyApi.artists.getArtist(artistId);
      const validatedArtist = ArtistSchema.safeParse(artist);
      if (!validatedArtist.success) {
        throw new TRPCError({
          message:
            'returned type from spotify-web-api-ts-edge get artist not valid',
          code: 'INTERNAL_SERVER_ERROR',
          cause: validatedArtist?.error,
        });
      }
      return { artist: validatedArtist.data };
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
        cursor: z
          .number()
          .optional()
          .nullable()
          .describe('The offset to get the albums'),
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
          .nullable()
          .describe(
            'The next offset that should be used for fetching again if using infite query',
          ),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { cursor, artistId, limit } = input;
      const albums = await ctx.spotifyApi.artists.getArtistAlbums(artistId, {
        offset: cursor ?? 0,
        limit: limit || 15,
      });
      const validatedAlbums = PagingSimplifiedAlbumsSchema.safeParse(albums);
      if (!validatedAlbums.success) {
        throw new TRPCError({
          message:
            'returned type from spotify-web-api-ts-edge  get artist albums not valid',
          code: 'INTERNAL_SERVER_ERROR',
          cause: validatedAlbums?.error,
        });
      }
      const { data } = validatedAlbums;
      const nextUrl = data?.next && new URL(data.next);
      const albumOffset =
        Number(
          new URLSearchParams((nextUrl?.search as string) || undefined).get(
            'offset',
          ),
        ) || undefined;

      return { albums: data?.items, nextCursor: albumOffset };
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
      const track = await ctx.spotifyApi.tracks.getTrack(input.trackId);
      const validatedTrack = TrackSchema.safeParse(track);
      if (validatedTrack.success) {
        return { track: validatedTrack.data };
      } else {
        throw new TRPCError({
          message:
            'returned type from spotify-web-api-ts-edge get track not valid',
          code: 'INTERNAL_SERVER_ERROR',
          cause: validatedTrack.error,
        });
      }
    }),
  getSearch: protectedTokenProcedure
    .meta({
      description:
        'Gets the search results for the specified media types based on text',
    })
    .input(
      z.object({
        searchTerm: z.string().min(1).describe('The text to be searched.'),
        cursor: z
          .object({
            albums: z.number().optional().nullable(),
            tracks: z.number().optional().nullable(),
            artists: z.number().optional().nullable(),
          })
          .optional()
          .nullable(),
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
            albums: z.number().optional().nullable(),
            tracks: z.number().optional().nullable(),
            artists: z.number().optional().nullable(),
          })
          .optional()
          .nullable()
          .describe(
            'The next offset that should be used for fetching again if using infite query',
          ),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { cursor, mediaType, limit, searchTerm, includeExternalAudio } =
        input;
      type Promises = [
        Promise<PagingSimplifiedAlbumsType> | undefined,
        Promise<PagingTracksType> | undefined,
        Promise<PagingArtistsType> | undefined,
      ];
      const promises: Promises = [undefined, undefined, undefined];
      if (
        mediaType?.includes('album') ||
        (!mediaType && (cursor ? Boolean(cursor.albums) : true))
      ) {
        promises[0] = ctx.spotifyApi.search.searchAlbums(searchTerm, {
          limit: limit || 15,
          offset: cursor?.albums ?? 0,
        });
      }
      if (
        mediaType?.includes('track') ||
        (!mediaType && (cursor ? Boolean(cursor.tracks) : true))
      ) {
        promises[1] = ctx.spotifyApi.search.searchTracks(searchTerm, {
          limit: limit || 15,
          offset: cursor?.tracks ?? 0,
          include_external: includeExternalAudio ? 'audio' : undefined,
        });
      }
      if (
        mediaType?.includes('artist') ||
        (!mediaType && (cursor ? Boolean(cursor.artists) : true))
      ) {
        promises[2] = ctx.spotifyApi.search.searchArtists(searchTerm, {
          limit: limit || 15,
          offset: cursor?.artists ?? 0,
        });
      }
      const [albumsSearchContent, tracksSearchContent, artistsSearchContent] =
        await Promise.all(promises);
      const validatedSearchContent = SearchContentSchema.safeParse({
        albums: albumsSearchContent,
        tracks: tracksSearchContent,
        artists: artistsSearchContent,
      });
      if (!validatedSearchContent.success) {
        console.error({
          albumsSearchContent,
          tracksSearchContent,
          artistsSearchContent,
        });
        throw new TRPCError({
          message: 'returned type from spotify-web-api-ts-edge not valid',
          code: 'INTERNAL_SERVER_ERROR',
          cause: validatedSearchContent.error,
        });
      }
      const { data } = validatedSearchContent;

      const albumOffset =
        Number(
          new URLSearchParams(data?.albums?.next ?? undefined).get('offset'),
        ) || null;
      const trackOffset =
        Number(
          new URLSearchParams(data?.tracks?.next ?? undefined).get('offset'),
        ) || null;
      const artistOffset =
        Number(
          new URLSearchParams(data?.artists?.next ?? undefined).get('offset'),
        ) || null;

      const nextCursor =
        !albumOffset && !trackOffset && !artistOffset
          ? null
          : {
              albums: albumOffset,
              tracks: trackOffset,
              artists: artistOffset,
            };
      return {
        albums: data?.albums?.items,
        tracks: data?.tracks?.items,
        artists: data?.artists?.items,
        nextCursor,
      };
    }),
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

      const lyrics = await getLyrics({
        title: songTitle,
        artist: artistName,
        optimizeQuery: true,
      });

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

export type SpotifyRouterInputs = inferRouterInputs<typeof spotifyRouter>;
export type SpotifyRouterOutputs = inferRouterOutputs<typeof spotifyRouter>;
