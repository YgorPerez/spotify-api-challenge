import { z } from 'zod'

export const ExternalIDSchema = z.object({
  ean: z.union([z.string(), z.undefined()]).optional(),
  isrc: z.union([z.string(), z.undefined()]).optional(),
  upc: z.union([z.string(), z.undefined()]).optional(),
})

export const ExternalUrlSchema = z.object({
  spotify: z.string(),
})

export const ImageSchema = z.object({
  height: z.number().nullable(),
  url: z.string(),
  width: z.number().nullable(),
})

export const CopyrightSchema = z.object({
  text: z.string(),
  type: z.union([z.literal('C'), z.literal('P')]),
})

export const RestrictionSchema = z.union([
  z.object({
    reason: z.union([
      z.literal('market'),
      z.literal('product'),
      z.literal('explicit'),
    ]),
  }),
  z.undefined(),
])

export const SearchTypeSchema = z.union([
  z.literal('album'),
  z.literal('artist'),
  z.literal('track'),
  z.literal('show'),
  z.literal('episode'),
])

export const SpotifyTypeSchema = z.union([
  z.literal('user'),
  z.literal('episode'),
  z.literal('playlist'),
  z.literal('show'),
  z.literal('track'),
  z.literal('album'),
  z.literal('artist'),
])

export const AlbumTypeSchema = z.union([
  z.literal('single'),
  z.literal('album'),
  z.literal('compilation'),
])

export const AlbumGroupSchema = z.union([
  AlbumTypeSchema,
  z.literal('appears_on'),
])

export const SimplifiedArtistSchema = z.object({
  externalURL: ExternalUrlSchema,
  id: z.string(),
  name: z.string(),
  type: SpotifyTypeSchema,
  uri: z.string(),
})

export const ArtistSchema = SimplifiedArtistSchema.extend({
  totalFollowers: z.number().optional(),
  genres: z.array(z.string()).optional(),
  images: z.array(ImageSchema).optional(),
  popularity: z.number().optional(),
})

export const LinkedTrackSchema = z.object({
  externalURL: ExternalUrlSchema,
  id: z.string(),
  type: SpotifyTypeSchema,
  uri: z.string(),
})

export const SimplifiedAlbumSchema = z.object({
  albumGroup: AlbumGroupSchema.optional(),
  albumType: AlbumTypeSchema,
  artists: z.array(SimplifiedArtistSchema),
  availableMarkets: z.array(z.string()).optional(),
  externalURL: ExternalUrlSchema,
  id: z.string(),
  images: z.array(ImageSchema),
  name: z.string(),
  releaseDate: z.string(),
  releaseDatePrecision: z.string(),
  restrictions: z.array(RestrictionSchema),
  totalTracks: z.number(),
  type: SpotifyTypeSchema,
  uri: z.string(),
})

export const SimplifiedTrackSchema = z.object({
  artists: z.array(SimplifiedArtistSchema),
  availableMarkets: z.array(z.string()).optional(),
  discNumber: z.number(),
  duration: z.number(),
  explicit: z.boolean(),
  externalURL: ExternalUrlSchema,
  href: z.string().optional(),
  id: z.string(),
  isLocal: z.boolean(),
  isPlayable: z.boolean().optional(),
  linkedFrom: LinkedTrackSchema.optional(),
  name: z.string(),
  previewURL: z.string().nullable(),
  restrictions: z.array(RestrictionSchema),
  trackNumber: z.number(),
  type: SpotifyTypeSchema,
  uri: z.string(),
})

export const TrackSchema = SimplifiedTrackSchema.extend({
  album: SimplifiedAlbumSchema.optional(),
  externalID: ExternalIDSchema.optional(),
  popularity: z.number().optional(),
})

export const PagingSimplifiedTrackSchema = z.object({
  href: z.string().optional(),
  items: z.array(SimplifiedTrackSchema),
  limit: z.number(),
  next: z.string(),
  offset: z.number(),
  previous: z.string(),
  total: z.number(),
})

export const AlbumSchema = SimplifiedAlbumSchema.extend({
  copyrights: z.array(CopyrightSchema).optional(),
  externalID: ExternalIDSchema.optional(),
  genres: z.array(z.string()).optional(),
  label: z.string().optional(),
  popularity: z.number().optional(),
  tracks: z.array(SimplifiedTrackSchema).optional(),
})

export const SearchContentSchema = z.object({
  tracks: z.array(TrackSchema).optional(),
  artists: z.array(ArtistSchema).optional(),
  albums: z.array(SimplifiedAlbumSchema).optional(),
})
