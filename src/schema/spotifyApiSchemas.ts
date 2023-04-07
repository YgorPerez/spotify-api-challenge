import { z } from "zod"

export const ActionSchema = z.union([
  z.literal("interrupting_playback"),
  z.literal("pausing"),
  z.literal("resuming"),
  z.literal("seeking"),
  z.literal("skipping_next"),
  z.literal("skipping_prev"),
  z.literal("toggling_repeat_context"),
  z.literal("toggling_shuffle"),
  z.literal("toggling_repeat_track"),
  z.literal("transferring_playback")
])

export const AudioFeaturesSchema = z.object({
  duration_ms: z.number(),
  key: z.number(),
  mode: z.number(),
  time_signature: z.number(),
  acousticness: z.number(),
  danceability: z.number(),
  energy: z.number(),
  instrumentalness: z.number(),
  liveness: z.number(),
  loudness: z.number(),
  speechiness: z.number(),
  valence: z.number(),
  tempo: z.number(),
  id: z.string(),
  uri: z.string(),
  track_href: z.string(),
  analysis_url: z.string(),
  type: z.literal("audio_features")
})

export const CopyrightSchema = z.object({
  text: z.string(),
  type: z.union([z.literal("C"), z.literal("P")])
})

export const DeviceTypeSchema = z.union([
  z.literal("Computer"),
  z.literal("Tablet"),
  z.literal("Smartphone"),
  z.literal("Speaker"),
  z.literal("TV"),
  z.literal("AVR"),
  z.literal("STB"),
  z.literal("AudioDongle"),
  z.literal("GameConsole"),
  z.literal("CastVideo"),
  z.literal("CastAudio"),
  z.literal("Automobile"),
  z.literal("Unknown")
])

export const ExplicitContentSchema = z.object({
  filter_enabled: z.boolean(),
  filter_locked: z.boolean()
})

export const ExternalIdSchema = z.record(z.string())

export const ExternalUrlSchema = z.record(z.string())

export const FollowersSchema = z.object({
  href: z.string().nullable(),
  total: z.number()
})

export const GetRecommendationsSeedsSchema = z.object({
  seed_artists: z.array(z.string()).optional(),
  seed_genres: z.array(z.string()).optional(),
  seed_tracks: z.array(z.string()).optional()
})

export const PlaylistDetailsSchema = z.object({
  name: z.string().optional(),
  public: z.boolean().optional(),
  collaborative: z.boolean().optional(),
  description: z.string().optional()
})

export const RecommendationSeedSchema = z.object({
  afterFilteringSize: z.number(),
  afterRelinkingSize: z.number(),
  href: z.string().nullable(),
  id: z.string(),
  initialPoolSize: z.number(),
  type: z.union([
    z.literal("artist"),
    z.literal("ARTIST"),
    z.literal("track"),
    z.literal("TRACK"),
    z.literal("genre"),
    z.literal("GENRE")
  ])
})

export const RegularErrorSchema = z.object({
  error: z.object({
    status: z.number(),
    message: z.string()
  })
})

export const RepeatStateSchema = z.union([
  z.literal("track"),
  z.literal("context"),
  z.literal("off")
])

export const ResumePointSchema = z.object({
  fully_played: z.boolean(),
  resume_position_ms: z.number()
})

export const RestrictionsSchema = z.object({
  reason: z.string()
})

export const SearchTypeSchema = z.union([
  z.literal("album"),
  z.literal("artist"),
  z.literal("playlist"),
  z.literal("track"),
  z.literal("show"),
  z.literal("episode")
])

export const SectionSchema = z.object({
  start: z.number(),
  duration: z.number(),
  confidence: z.number(),
  loudness: z.number(),
  tempo: z.number(),
  tempo_confidence: z.number(),
  key: z.number(),
  key_confidence: z.number(),
  mode: z.number(),
  mode_confidence: z.number(),
  time_signature: z.number(),
  time_signature_confidence: z.number()
})

export const SegmentSchema = z.object({
  start: z.number(),
  duration: z.number(),
  confidence: z.number(),
  loudness_start: z.number(),
  loudness_max: z.number(),
  loudness_max_time: z.number(),
  loudness_end: z.number(),
  pitches: z.array(z.number()),
  timbre: z.array(z.number())
})

export const SimplifiedArtistSchema = z.object({
  external_urls: ExternalUrlSchema,
  href: z.string(),
  id: z.string(),
  name: z.string(),
  type: z.literal("artist"),
  uri: z.string()
})

export const SpotifyImageSchema = z.object({
  height: z.number().nullable(),
  url: z.string(),
  width: z.number().nullable()
})

export const TimeIntervalSchema = z.object({
  start: z.number(),
  duration: z.number(),
  confidence: z.number()
})

export const TrackLinkSchema = z.object({
  external_urls: ExternalUrlSchema,
  href: z.string(),
  id: z.string(),
  type: z.literal("track"),
  uri: z.string()
})

export const TracksSchema = z.object({
  href: z.string(),
  total: z.number()
})

export const VideoThumbnailSchema = z.object({
  url: z.string().nullable()
})

export const ArtistSchema = z.object({
  external_urls: ExternalUrlSchema,
  followers: FollowersSchema,
  genres: z.array(z.string()),
  href: z.string(),
  id: z.string(),
  images: z.array(SpotifyImageSchema),
  name: z.string(),
  popularity: z.number(),
  type: z.literal("artist"),
  uri: z.string()
})

export const AudioAnalysisSchema = z.object({
  bars: z.array(TimeIntervalSchema),
  beats: z.array(TimeIntervalSchema),
  meta: z.unknown().optional(),
  sections: z.array(SectionSchema),
  segments: z.array(SegmentSchema),
  tatums: z.array(TimeIntervalSchema),
  track: z.unknown().optional()
})

export const CategorySchema = z.object({
  href: z.string(),
  icons: z.array(SpotifyImageSchema),
  id: z.string(),
  name: z.string()
})

export const ContextSchema = z.object({
  uri: z.string(),
  href: z.string().nullable(),
  external_urls: ExternalUrlSchema.nullable(),
  type: z.union([
    z.literal("album"),
    z.literal("artist"),
    z.literal("playlist")
  ])
})

export const DeviceSchema = z.object({
  id: z.string().nullable(),
  is_active: z.boolean(),
  is_private_session: z.boolean(),
  is_restricted: z.boolean(),
  name: z.string(),
  type: DeviceTypeSchema,
  volume_percent: z.number().nullable()
})

export const PrivateUserSchema = z.object({
  birthdate: z.string().optional(),
  country: z.string().optional(),
  display_name: z.string().nullable(),
  email: z.string().optional(),
  explicit_content: ExplicitContentSchema.optional(),
  external_urls: ExternalUrlSchema,
  followers: FollowersSchema,
  href: z.string(),
  id: z.string(),
  images: z.array(SpotifyImageSchema),
  product: z.string().optional(),
  type: z.literal("user"),
  uri: z.string()
})

export const PublicUserSchema = z.object({
  display_name: z
    .string()
    .optional()
    .nullable(),
  external_urls: ExternalUrlSchema,
  followers: FollowersSchema.optional(),
  href: z.string(),
  id: z.string(),
  images: z.array(SpotifyImageSchema).optional(),
  type: z.literal("user"),
  uri: z.string()
})

export const SimplifiedAlbumSchema = z.object({
  album_group: z
    .union([
      z.literal("album"),
      z.literal("single"),
      z.literal("compilation"),
      z.literal("appears_on")
    ])
    .optional(),
  album_type: z.union([
    z.literal("album"),
    z.literal("ALBUM"),
    z.literal("single"),
    z.literal("SINGLE"),
    z.literal("compilation"),
    z.literal("COMPILATION")
  ]),
  artists: z.array(SimplifiedArtistSchema),
  available_markets: z.array(z.string()).optional(),
  external_urls: ExternalUrlSchema,
  href: z.string(),
  id: z.string(),
  images: z.array(SpotifyImageSchema),
  name: z.string(),
  release_date: z.string(),
  release_date_precision: z.union([
    z.literal("year"),
    z.literal("month"),
    z.literal("day")
  ]),
  restrictions: RestrictionsSchema.optional(),
  total_tracks: z.number(),
  type: z.literal("album"),
  uri: z.string()
})

export const SimplifiedEpisodeSchema = z.object({
  audio_preview_url: z.string().nullable(),
  description: z.string(),
  duration_ms: z.number(),
  explicit: z.boolean(),
  external_urls: ExternalUrlSchema,
  href: z.string(),
  id: z.string(),
  images: z.array(SpotifyImageSchema),
  is_externally_hosted: z.boolean(),
  is_playable: z.boolean(),
  language: z.string().optional(),
  languages: z.array(z.string()),
  name: z.string(),
  release_date: z.string(),
  release_date_precision: z.union([
    z.literal("year"),
    z.literal("month"),
    z.literal("day")
  ]),
  resume_point: ResumePointSchema.optional(),
  type: z.literal("episode"),
  uri: z.string()
})

export const SimplifiedPlaylistSchema = z.object({
  collaborative: z.boolean(),
  description: z.string().nullable(),
  external_urls: ExternalUrlSchema,
  href: z.string(),
  id: z.string(),
  images: z.array(SpotifyImageSchema),
  name: z.string(),
  owner: PublicUserSchema,
  primary_color: z.string().nullable(),
  public: z.boolean().nullable(),
  snapshot_id: z.string(),
  tracks: TracksSchema,
  type: z.literal("playlist"),
  uri: z.string()
})

export const SimplifiedShowSchema = z.object({
  available_markets: z.array(z.string()),
  copyrights: z.array(CopyrightSchema),
  description: z.string(),
  explicit: z.boolean(),
  external_urls: ExternalUrlSchema,
  href: z.string(),
  id: z.string(),
  images: z.array(SpotifyImageSchema),
  is_externally_hosted: z.boolean().nullable(),
  languages: z.array(z.string()),
  media_type: z.string(),
  name: z.string(),
  publisher: z.string(),
  type: z.literal("show"),
  uri: z.string()
})

export const SimplifiedTrackSchema = z.object({
  artists: z.array(SimplifiedArtistSchema),
  available_markets: z.array(z.string()),
  disc_number: z.number(),
  duration_ms: z.number(),
  explicit: z.boolean(),
  external_urls: ExternalUrlSchema,
  href: z.string(),
  id: z.string(),
  is_playable: z.boolean().optional(),
  linked_from: TrackLinkSchema.optional(),
  restrictions: RestrictionsSchema.optional(),
  name: z.string(),
  preview_url: z.string(),
  track_number: z.number(),
  type: z.literal("track"),
  uri: z.string(),
  is_local: z.boolean()
})

export const TrackSchema = z.object({
  album: SimplifiedAlbumSchema,
  artists: z.array(SimplifiedArtistSchema),
  available_markets: z.array(z.string()).optional(),
  disc_number: z.number(),
  duration_ms: z.number(),
  episode: z.boolean().optional(),
  explicit: z.boolean(),
  external_ids: ExternalIdSchema,
  external_urls: ExternalUrlSchema,
  href: z.string(),
  id: z.string(),
  is_playable: z.boolean().optional(),
  linked_from: TrackLinkSchema.optional(),
  restrictions: RestrictionsSchema.optional(),
  name: z.string(),
  popularity: z.number(),
  preview_url: z.string().nullable(),
  track: z.boolean().optional(),
  track_number: z.number(),
  type: z.literal("track"),
  uri: z.string(),
  is_local: z.boolean()
})

export const CurrentlyPlayingContextSchema = z.object({
  device: DeviceSchema,
  repeat_state: z.union([
    z.literal("off"),
    z.literal("track"),
    z.literal("context")
  ]),
  shuffle_state: z.boolean(),
  context: ContextSchema.nullable(),
  timestamp: z.number(),
  progress_ms: z.number().nullable(),
  is_playing: z.boolean(),
  item: TrackSchema.nullable(),
  currently_playing_type: z.union([
    z.literal("track"),
    z.literal("episode"),
    z.literal("ad"),
    z.literal("unknown")
  ])
})

export const EpisodeSchema = z.object({
  audio_preview_url: z.string().nullable(),
  description: z.string(),
  duration_ms: z.number(),
  explicit: z.boolean(),
  external_urls: ExternalUrlSchema,
  href: z.string(),
  id: z.string(),
  images: z.array(SpotifyImageSchema),
  is_externally_hosted: z.boolean(),
  is_playable: z.boolean(),
  language: z.string().optional(),
  languages: z.array(z.string()),
  name: z.string(),
  release_date: z.string(),
  release_date_precision: z.union([
    z.literal("year"),
    z.literal("month"),
    z.literal("day")
  ]),
  resume_point: ResumePointSchema.optional(),
  show: SimplifiedShowSchema,
  type: z.literal("episode"),
  uri: z.string()
})

export const PagingSimplifiedTracksSchema = z.object({
  href: z.string(),
  items: z.array(SimplifiedTrackSchema),
  limit: z.number(),
  next: z.string().nullable(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number()
})

export const PagingSimplifiedEpisodeSchema = z.object({
  href: z.string(),
  items: z.array(SimplifiedEpisodeSchema),
  limit: z.number(),
  next: z.string().nullable(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number()
})

export const PlayHistorySchema = z.object({
  track: TrackSchema,
  played_at: z.string(),
  context: ContextSchema.nullable()
})

export const PlaylistItemSchema = z.object({
  added_at: z.string().nullable(),
  added_by: PublicUserSchema.nullable(),
  is_local: z.boolean(),
  primary_color: z
    .string()
    .optional()
    .nullable(),
  track: z.union([TrackSchema, EpisodeSchema]),
  video_thumbnail: VideoThumbnailSchema.optional()
})

export const SavedShowSchema = z.object({
  added_at: z.string(),
  show: SimplifiedShowSchema
})

export const SavedTrackSchema = z.object({
  added_at: z.string(),
  track: TrackSchema
})

export const ShowSchema = z.object({
  available_markets: z.array(z.string()),
  copyrights: z.array(CopyrightSchema),
  description: z.string(),
  explicit: z.boolean(),
  episodes: PagingSimplifiedEpisodeSchema,
  external_urls: ExternalUrlSchema,
  href: z.string(),
  id: z.string(),
  images: z.array(SpotifyImageSchema),
  is_externally_hosted: z.boolean().nullable(),
  languages: z.array(z.string()),
  media_type: z.string(),
  name: z.string(),
  publisher: z.string(),
  type: z.literal("show"),
  uri: z.string()
})

export const AlbumSchema = z.object({
  album_type: z.union([
    z.literal("album"),
    z.literal("single"),
    z.literal("compilation")
  ]),
  artists: z.array(SimplifiedArtistSchema),
  available_markets: z.array(z.string()),
  copyrights: z.array(CopyrightSchema),
  external_ids: ExternalIdSchema,
  external_urls: ExternalUrlSchema,
  genres: z.array(z.string()),
  href: z.string(),
  id: z.string(),
  images: z.array(SpotifyImageSchema),
  label: z.string(),
  name: z.string(),
  popularity: z.number(),
  release_date: z.string(),
  release_date_precision: z.union([
    z.literal("year"),
    z.literal("month"),
    z.literal("day")
  ]),
  restrictions: RestrictionsSchema.optional(),
  total_tracks: z.number(),
  tracks: PagingSimplifiedTracksSchema,
  type: z.literal("album"),
  uri: z.string()
})

export const CurrentlyPlayingSchema = z.object({
  context: ContextSchema.nullable(),
  timestamp: z.number(),
  progress_ms: z.number().nullable(),
  is_playing: z.boolean(),
  item: z.union([EpisodeSchema, TrackSchema]).nullable(),
  currently_playing_type: z.union([
    z.literal("track"),
    z.literal("episode"),
    z.literal("ad"),
    z.literal("unknown")
  ])
})

export const PagingPlaylistItemSchema = z.object({
  href: z.string(),
  items: z.array(PlaylistItemSchema),
  limit: z.number(),
  next: z.string().nullable(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number()
})

export const PlaylistSchema = z.object({
  collaborative: z.boolean(),
  description: z.string().nullable(),
  external_urls: ExternalUrlSchema,
  followers: FollowersSchema,
  href: z.string(),
  id: z.string(),
  images: z.array(SpotifyImageSchema),
  name: z.string(),
  owner: PublicUserSchema,
  primary_color: z
    .string()
    .optional()
    .nullable(),
  public: z.boolean().nullable(),
  snapshot_id: z.string(),
  tracks: PagingPlaylistItemSchema,
  type: z.literal("playlist"),
  uri: z.string()
})

export const SavedAlbumSchema = z.object({
  added_at: z.string(),
  album: AlbumSchema
})

export const SearchContentSchema = z.object({
  tracks: TrackSchema.optional(),
  albums: AlbumSchema.optional(),
  artists: ArtistSchema.optional()
})
