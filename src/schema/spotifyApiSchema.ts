import { z } from 'zod'

export const ExternalUrlSchema = z.object({
  spotify: z.string(),
})

export const SpotifyTypeSchema = z.union([
  z.literal('user'),
  z.literal('episode'),
  z.literal('playlist'),
  z.literal('show'),
  z.literal('track'),
  z.literal('album'),
  z.literal('artist'),
])

export const LinkedTrackSchema = z.object({
  external_urls: ExternalUrlSchema,
  id: z.string(),
  type: SpotifyTypeSchema,
  uri: z.string(),
})

const RestrictionsSchema = z.object({
  reason: z.string(),
})

export const FollowersSchema = z.object({
  href: z.null(),
  total: z.number(),
})

export const ImageSchema = z.object({
  height: z.union([z.number(), z.undefined()]).optional(),
  url: z.string(),
  width: z.union([z.number(), z.undefined()]).optional(),
})

export const ContextObjectSchema = z.object({
  type: z.union([
    z.literal('artist'),
    z.literal('playlist'),
    z.literal('album'),
    z.literal('show'),
    z.literal('episode'),
  ]),
  href: z.string(),
  external_urls: ExternalUrlSchema,
  uri: z.string(),
})

export const SimplifiedArtistSchema = ContextObjectSchema.extend({
  name: z.string(),
  id: z.string(),
  type: z.literal('artist'),
})

export const AlbumTypeSchema = z.union([
  z.literal('single'),
  z.literal('album'),
  z.literal('compilation'),
])

export const AlbumGroupSchema = z.union([
  AlbumTypeSchema,
  z.literal('appears_on'),
])

export const CopyrightSchema = z.object({
  text: z.string(),
  type: z.union([z.literal('C'), z.literal('P')]),
})

export const ArtistSchema = SimplifiedArtistSchema.extend({
  followers: FollowersSchema,
  genres: z.array(z.string()),
  images: z.array(ImageSchema),
  popularity: z.number(),
})

export const SimplifiedAlbumSchema = ContextObjectSchema.extend({
  album_group: z
    .union([
      z.literal('album'),
      z.literal('single'),
      z.literal('compilation'),
      z.literal('appears_on'),
      z.undefined(),
    ])
    .optional(),
  album_type: z.union([
    z.literal('album'),
    z.literal('single'),
    z.literal('compilation'),
  ]),
  artists: z.array(SimplifiedArtistSchema),
  available_markets: z.union([z.array(z.string()), z.undefined()]).optional(),
  id: z.string(),
  images: z.array(ImageSchema),
  name: z.string(),
  release_date: z.string(),
  release_date_precision: z.union([
    z.literal('year'),
    z.literal('month'),
    z.literal('day'),
  ]),
  restrictions: z.union([RestrictionsSchema, z.undefined()]).optional(),
  type: z.literal('album'),
  total_tracks: z.number(),
})

const ExternalIdSchema = z.object({
  isrc: z.union([z.string(), z.undefined()]).optional(),
  ean: z.union([z.string(), z.undefined()]).optional(),
  upc: z.union([z.string(), z.undefined()]).optional(),
})

const TrackLinkSchema = z.object({
  external_urls: ExternalUrlSchema,
  href: z.string(),
  id: z.string(),
  type: z.literal('track'),
  uri: z.string(),
})

export const SimplifiedTrackSchema = z.object({
  artists: z.array(SimplifiedArtistSchema),
  available_markets: z.union([z.array(z.string()), z.undefined()]).optional(),
  disc_number: z.number(),
  duration_ms: z.number(),
  explicit: z.boolean(),
  external_urls: ExternalUrlSchema,
  href: z.string(),
  id: z.string(),
  is_playable: z.union([z.boolean(), z.undefined()]).optional(),
  linked_from: z.union([TrackLinkSchema, z.undefined()]).optional(),
  restrictions: z.union([RestrictionsSchema, z.undefined()]).optional(),
  name: z.string(),
  preview_url: z.string().nullable(),
  track_number: z.number(),
  type: z.literal('track'),
  uri: z.string(),
})

const PagingTrackSchema = z.object({
  href: z.string(),
  items: z.array(SimplifiedTrackSchema),
  limit: z.number(),
  next: z.string().nullable(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number(),
})

export const TrackSchema = SimplifiedTrackSchema.extend({
  album: SimplifiedAlbumSchema,
  external_ids: ExternalIdSchema,
  popularity: z.number(),
  is_local: z.union([z.boolean(), z.undefined()]).optional(),
})

export const AlbumSchema = SimplifiedAlbumSchema.extend({
  copyrights: z.array(CopyrightSchema),
  external_ids: ExternalIdSchema,
  genres: z.array(z.string()),
  label: z.string(),
  popularity: z.number(),
  tracks: PagingTrackSchema,
})

export const SearchContentSchema = z.object({
  tracks: z.array(TrackSchema).optional(),
  artists: z.array(ArtistSchema).optional(),
  albums: z.array(AlbumSchema).optional(),
})
