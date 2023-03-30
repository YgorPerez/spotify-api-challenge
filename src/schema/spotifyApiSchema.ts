import { z } from 'zod'
import { type Album } from './spotifyApiTypes'

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

export const SimplifiedArtistSchema = z.object({
  externalURL: ExternalUrlSchema,
  href: z.string().optional(),
  id: z.string(),
  name: z.string(),
  type: SpotifyTypeSchema,
  uri: z.string(),
})

export const LinkedTrackSchema = z.object({
  externalURL: ExternalUrlSchema,
  id: z.string(),
  type: SpotifyTypeSchema,
  uri: z.string(),
})

export const RestrictionSchema = z.object({
  reason: z.union([
    z.literal('market'),
    z.literal('product'),
    z.literal('explicit'),
  ]),
})

export const SimplifiedTrackSchema = z.object({
  artists: z.array(SimplifiedArtistSchema),
  availableMarkets: z.array(z.string()).optional(),
  discNumber: z.number(),
  durationMs: z.number(),
  explicit: z.boolean(),
  externalURL: ExternalUrlSchema,
  href: z.string(),
  id: z.string(),
  isLocal: z.boolean(),
  isPlayable: z.boolean().optional(),
  linkedFrom: LinkedTrackSchema.optional(),
  name: z.string(),
  previewURL: z.string(),
  restrictions: z.array(RestrictionSchema),
  trackNumber: z.number(),
  type: SpotifyTypeSchema,
  uri: z.string(),
})

export const ImageSchema = z.object({
  height: z.number().nullable(),
  url: z.string(),
  width: z.number().nullable(),
})

export const ExternalIDSchema = z.object({
  ean: z.string().optional(),
  isrc: z.string().optional(),
  upc: z.string().optional(),
})

export const FollowersSchema = z.object({
  href: z.string().nullable(),
  total: z.number(),
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

export const ArtistSchema = z.object({
  externalURL: ExternalUrlSchema,
  id: z.string(),
  name: z.string(),
  href: z.string().optional(),
  type: SpotifyTypeSchema,
  uri: z.string(),
  images: z.array(ImageSchema).optional(),
  popularity: z.number().optional(),
  genres: z.array(z.string()).optional(),
  totalFollowers: z.number().optional(),
})

export const SimplifiedAlbumSchema = z.object({
  artists: z.array(SimplifiedArtistSchema),
  albumType: AlbumTypeSchema,
  availableMarkets: z.array(z.string()).optional(),
  externalURL: ExternalUrlSchema,
  id: z.string(),
  images: z.array(ImageSchema),
  name: z.string(),
  href: z.string().optional(),
  releaseDate: z.string(),
  releaseDatePrecision: z.string(),
  restrictions: z.array(RestrictionSchema),
  totalTracks: z.number(),
  type: SpotifyTypeSchema,
  uri: z.string(),
  albumGroup: AlbumGroupSchema.optional(),
})

export const TrackSchema = z.object({
  artists: z.array(ArtistSchema),
  availableMarkets: z.array(z.string()),
  discNumber: z.number(),
  duration: z.number(),
  explicit: z.boolean(),
  externalURL: ExternalUrlSchema,
  id: z.string(),
  isLocal: z.boolean(),
  name: z.string(),
  previewURL: z.string().nullable(),
  restrictions: z.array(RestrictionSchema.optional()).optional(),
  isPlayable: z.boolean().optional(),
  linkedFrom: LinkedTrackSchema.optional(),
  trackNumber: z.number(),
  type: SpotifyTypeSchema,
  uri: z.string(),
  album: z.lazy(() => AlbumSchema.optional()),
  externalID: ExternalIDSchema.optional(),
  popularity: z.number().optional(),
})

export const AlbumSchema: z.ZodType<Album> = z.object({
  artists: z.array(ArtistSchema),
  albumType: AlbumTypeSchema,
  availableMarkets: z.array(z.string()),
  externalURL: ExternalUrlSchema,
  id: z.string(),
  images: z.array(ImageSchema),
  name: z.string(),
  releaseDate: z.string(),
  releaseDatePrecision: z.string(),
  restrictions: z.array(RestrictionSchema.optional()).optional(),
  totalTracks: z.number(),
  type: SpotifyTypeSchema,
  uri: z.string(),
  copyrights: z.array(CopyrightSchema).optional(),
  externalID: ExternalIDSchema.optional(),
  genres: z.array(z.string()).optional(),
  label: z.string().optional(),
  popularity: z.number().optional(),
  tracks: z.array(TrackSchema).optional(),
  albumGroup: z
    .union([
      z.literal('album'),
      z.literal('single'),
      z.literal('compilation'),
      z.literal('appears_on'),
    ])
    .optional(),
})

export const SearchContentSchema = z.object({
  tracks: z.array(TrackSchema).optional(),
  artists: z.array(ArtistSchema).optional(),
  albums: z.array(AlbumSchema).optional(),
})
