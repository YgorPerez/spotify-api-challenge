import { z } from 'zod';

export const ExternalUrlSchema = z.record(z.string());

export const FollowersSchema = z.object({
  href: z.string().nullable(),
  total: z.number(),
});

export const PrivateUserSchema = z.object({
  product: z.string().optional(),
});

export const SimplifiedArtistSchema = z.object({
  external_urls: ExternalUrlSchema,
  href: z.string(),
  id: z.string(),
  name: z.string(),
  type: z.literal('artist'),
  uri: z.string(),
});

export const SpotifyImageSchema = z.object({
  height: z.number().nullable(),
  url: z.string(),
  width: z.number().nullable(),
});

export const ArtistSchema = z.object({
  external_urls: ExternalUrlSchema,
  followers: FollowersSchema,
  href: z.string(),
  id: z.string(),
  images: z.array(SpotifyImageSchema),
  name: z.string(),
  type: z.literal('artist'),
  uri: z.string(),
});

export const SimplifiedAlbumSchema = z.object({
  album_type: z.union([
    z.literal('album'),
    z.literal('ALBUM'),
    z.literal('single'),
    z.literal('SINGLE'),
    z.literal('compilation'),
    z.literal('COMPILATION'),
  ]),
  artists: z.array(SimplifiedArtistSchema),
  external_urls: ExternalUrlSchema,
  href: z.string(),
  id: z.string(),
  images: z.array(SpotifyImageSchema),
  name: z.string(),
  type: z.literal('album'),
  uri: z.string(),
});

export const SimplifiedTrackSchema = z.object({
  artists: z.array(SimplifiedArtistSchema),
  duration_ms: z.number(),
  external_urls: ExternalUrlSchema,
  href: z.string(),
  id: z.string(),
  name: z.string(),
  preview_url: z.string().nullable(),
  type: z.literal('track'),
  uri: z.string(),
});

export const TrackSchema = z.object({
  album: SimplifiedAlbumSchema,
  artists: z.array(SimplifiedArtistSchema),
  duration_ms: z.number(),
  external_urls: ExternalUrlSchema,
  href: z.string(),
  id: z.string(),
  name: z.string(),
  preview_url: z.string().nullable(),
  track: z.boolean().optional(),
  type: z.literal('track'),
  uri: z.string(),
});

export const PagingSimplifiedTracksSchema = z.object({
  href: z.string(),
  items: z.array(SimplifiedTrackSchema),
  limit: z.number(),
  next: z.string().nullable(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number(),
});

export const AlbumSchema = z.object({
  album_type: z.union([
    z.literal('album'),
    z.literal('single'),
    z.literal('compilation'),
  ]),
  artists: z.array(SimplifiedArtistSchema),
  external_urls: ExternalUrlSchema,
  href: z.string(),
  id: z.string(),
  images: z.array(SpotifyImageSchema),
  name: z.string(),
  tracks: PagingSimplifiedTracksSchema,
  type: z.literal('album'),
  uri: z.string(),
});

export const PagingArtistsSchema = z.object({
  href: z.string(),
  items: z.array(ArtistSchema),
  limit: z.number(),
  next: z.string().nullable(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number(),
});

export const PagingTracksSchema = z.object({
  href: z.string(),
  items: z.array(TrackSchema),
  limit: z.number(),
  next: z.string().nullable(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number(),
});

export const PagingSimplifiedAlbumsSchema = z.object({
  href: z.string(),
  items: z.array(SimplifiedAlbumSchema),
  limit: z.number(),
  next: z.string().nullable(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number(),
});

export const SearchContentItemsSchema = z.object({
  tracks: z.array(TrackSchema).optional().nullable(),
  albums: z.array(SimplifiedAlbumSchema).optional().nullable(),
  artists: z.array(ArtistSchema).optional().nullable(),
});

export const SearchContentSchema = z.object({
  tracks: PagingTracksSchema.nullable().optional(),
  albums: PagingSimplifiedAlbumsSchema.nullable().optional(),
  artists: PagingArtistsSchema.nullable().optional(),
});

export type TrackType = z.infer<typeof TrackSchema>;
export type AlbumType = z.infer<typeof AlbumSchema>;
export type ArtistType = z.infer<typeof ArtistSchema>;
export type SimplifiedTrackType = z.infer<typeof SimplifiedTrackSchema>;
export type SimplifiedAlbumType = z.infer<typeof SimplifiedAlbumSchema>;
export type SimplifiedArtistType = z.infer<typeof SimplifiedArtistSchema>;
export type ImageType = z.infer<typeof SpotifyImageSchema>;
