import { z } from "zod";

// you can view the official types at https://spotify-api.js.org/apiTypes/

export const Images = z
  .object({
    height: z.number().optional(),
    widht: z.number().optional(),
    url: z.string(),
  })
  .array();

export const Followers = z.object({
  href: z.string().optional(),
  total: z.number(),
});

export const ExternalUrl = z.object({
  spotify: z.string(),
});

export const ExternalID = z.object({
  ean: z.string(),
  isrc: z.string(),
  upc: z.string(),
});

export const SpotifyType = z.object({
  spotifyType: z.enum([
    "user",
    "episode",
    "playlist",
    "show",
    "track",
    "album",
    "artist",
  ]),
});

export const ALBUM_TYPE_VALUES = ["single", "album", "compilation"] as const;

export const AlbumType = z.object({
  type: z.enum(ALBUM_TYPE_VALUES),
});

export const AlbumGroup = z.object({
  albumType: z.enum([...ALBUM_TYPE_VALUES, "appears_on"]),
});

export const Restrictions = z
  .object({
    reason: z.enum(["market", "product", "explicit"]),
  })
  .array();

export const LinkedTrack = z.object({
  external_urls: ExternalUrl,
  id: z.string(),
  href: z.string(),
  spotifyType: SpotifyType,
  uri: z.string(),
});

export const ResumePoint = z.object({
  fully_played: z.boolean(),
  resume_position_ms: z.number(),
});

export const Copyrights = z
  .object({
    text: z.string(),
    type: z.enum(["C", "P"]),
  })
  .array();

export const SimplifiedShow = z.object({
  available_markets: z.string().array().optional(),
  copyrights: Copyrights,
  description: z.string(),
  explicit: z.boolean(),
  external_urls: ExternalUrl,
  href: z.string(),
  html_description: z.string(),
  id: z.string(),
  images: Images,
  is_externally_hosted: z.boolean(),
  languages: z.string().array(),
  media_type: z.string(),
  name: z.string(),
  publisher: z.string(),
  type: SpotifyType,
  uri: z.string(),
});

export const PublicUser = z.object({
  display_name: z.string().optional(),
  external_urls: ExternalUrl,
  followers: Followers,
  id: z.string(),
  images: Images,
  href: z.string().optional(),
  snapshot_id: z.string(),
  spotifyType: SpotifyType,
  uri: z.string(),
});

export const SimplifiedArtists = z
  .object({
    external_urls: ExternalUrl,
    href: z.string(),
    id: z.string(),
    name: z.string(),
    type: SpotifyType,
    uri: z.string(),
  })
  .array();

export const Artists = z
  .object({
    external_urls: ExternalUrl,
    followers: Followers,
    genres: z.string().array().optional(),
    href: z.string(),
    id: z.string(),
    images: Images,
    name: z.string(),
    popularity: z.number().min(0).max(100),
    type: SpotifyType,
    uri: z.string(),
  })
  .array();

export const SimplifiedAlbum = z.object({
  album_group: AlbumGroup.optional(),
  album_type: AlbumType,
  artists: SimplifiedArtists,
  available_markets: z.string().array().optional(),
  href: z.string(),
  id: z.string(),
  images: Images,
  name: z.string(),
  release_date: z.date(),
  release_date_precision: z.enum(["year", "day", "month"]),
  restrictions: Restrictions,
  total_tracks: z.number(),
  type: SpotifyType,
  uri: z.string(),
});

export const Track = z.object({
  album: SimplifiedAlbum,
  artists: Artists,
  available_markets: z.string().array().optional(),
  description: z.string().nullable(),
  disc_number: z.number(),
  duration_ms: z.number(),
  explicit: z.boolean(),
  external_urls: ExternalUrl,
  href: z.string(),
  id: z.string(),
  is_local: z.boolean(),
  is_playable: z.boolean().optional(),
  linked_from: LinkedTrack.optional(),
  name: z.string(),
  popularity: z.number().min(0).max(100),
  preview_url: z.string(),
  restrictions: Restrictions,
  track_number: z.number(),
  type: SpotifyType,
  uri: z.string(),
});

export const Episode = z.object({
  audio_preview_url: z.string().nullable(),
  description: z.string(),
  duration_ms: z.number(),
  explicit: z.boolean(),
  external_urls: ExternalUrl,
  href: z.string(),
  html_description: z.string(),
  id: z.string(),
  images: Images,
  is_externally_hosted: z.boolean(),
  is_playable: z.boolean().optional(),
  language: z.string().optional(),
  languages: z.string().array(),
  name: z.string(),
  release_date: z.date(),
  release_date_precision: z.enum(["year", "day", "month"]),
  restrictions: Restrictions,
  resume_point: ResumePoint,
  show: SimplifiedShow,
  type: SpotifyType,
  uri: z.string(),
});

export const PlaylistTrack = z.object({
  added_at: z.string().nullable(),
  added_by: PublicUser.nullable(),
  is_local: z.boolean(),
  track: z.enum([typeof Track, typeof Episode]).nullable(),
});

export const Playlist = z.object({
  collaborative: z.boolean(),
  description: z.string().nullable(),
  external_urls: ExternalUrl,
  followers: Followers,
  href: z.string(),
  id: z.string(),
  images: Images,
  name: z.string(),
  owner: PublicUser,
  public: z.boolean().nullable(),
  snapshot_id: z.string(),
  tracks: PlaylistTrack.array(),
  type: SpotifyType,
  uri: z.string(),
});
