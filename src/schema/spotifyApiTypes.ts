export type Action =
  | 'interrupting_playback'
  | 'pausing'
  | 'resuming'
  | 'seeking'
  | 'skipping_next'
  | 'skipping_prev'
  | 'toggling_repeat_context'
  | 'toggling_shuffle'
  | 'toggling_repeat_track'
  | 'transferring_playback';

export type Album = {
  album_type: 'album' | 'single' | 'compilation';
  artists: SimplifiedArtist[];
  available_markets: string[];
  copyrights: Copyright[];
  external_ids: ExternalID;
  external_urls: ExternalURL;
  genres: string[];
  href: string;
  id: string;
  images: SpotifyImage[];
  label: string;
  name: string;
  popularity: number;
  release_date: string;
  release_date_precision: 'year' | 'month' | 'day';
  restrictions?: Restrictions;
  total_tracks: number;
  tracks: PagingSimplifiedTracks;
  type: 'album';
  uri: string;
};

export type Artist = {
  external_urls: ExternalURL;
  followers: Followers;
  genres: string[];
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  popularity: number;
  type: 'artist';
  uri: string;
};

export type AudioAnalysis = {
  bars: TimeInterval[];
  beats: TimeInterval[];
  meta?: unknown;
  sections: Section[];
  segments: Segment[];
  tatums: TimeInterval[];
  track?: unknown;
};

export type AudioFeatures = {
  duration_ms: number;
  key: number;
  mode: number;
  time_signature: number;
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  liveness: number;
  loudness: number;
  speechiness: number;
  valence: number;
  tempo: number;
  id: string;
  uri: string;
  track_href: string;
  analysis_url: string;
  type: 'audio_features';
};

export type Category = {
  href: string;
  icons: SpotifyImage[];
  id: string;
  name: string;
};

export type Context = {
  uri: string;
  href: string | null;
  external_urls: ExternalURL | null;
  type: 'album' | 'artist' | 'playlist';
};

export type Copyright = {
  text: string;
  type: 'C' | 'P';
};

export type CurrentlyPlaying = {
  context: Context | null;
  timestamp: number;
  progress_ms: number | null;
  is_playing: boolean;
  item: Episode | Track | null;
  currently_playing_type: 'track' | 'episode' | 'ad' | 'unknown';
};

export type CurrentlyPlayingContext = {
  device: Device;
  repeat_state: 'off' | 'track' | 'context';
  shuffle_state: boolean;
  context: Context | null;
  timestamp: number;
  progress_ms: number | null;
  is_playing: boolean;
  item: Track | null;
  currently_playing_type: 'track' | 'episode' | 'ad' | 'unknown';
};

export type Device = {
  id: string | null;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: DeviceType;
  volume_percent: number | null;
};

export type DeviceType =
  | 'Computer'
  | 'Tablet'
  | 'Smartphone'
  | 'Speaker'
  | 'TV'
  | 'AVR'
  | 'STB'
  | 'AudioDongle'
  | 'GameConsole'
  | 'CastVideo'
  | 'CastAudio'
  | 'Automobile'
  | 'Unknown';

export type Episode = {
  audio_preview_url: string | null;
  description: string;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalURL;
  href: string;
  id: string;
  images: SpotifyImage[];
  is_externally_hosted: boolean;
  is_playable: boolean;
  language?: string;
  languages: string[];
  name: string;
  release_date: string;
  release_date_precision: 'year' | 'month' | 'day';
  resume_point?: ResumePoint;
  show: SimplifiedShow;
  type: 'episode';
  uri: string;
};

export type ExplicitContent = {
  filter_enabled: boolean;
  filter_locked: boolean;
};

export type ExternalID = {
  [key: string]: string;
};

export type ExternalURL = {
  [key: string]: string;
};

export type Followers = {
  href: string | null;
  total: number;
};

export type GetRecommendationsSeeds = {
  seed_artists?: string[];
  seed_genres?: string[];
  seed_tracks?: string[];
};

export type PagingSimplifiedTracks = {
  href: string;
  items: SimplifiedTrack[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
};

export type PagingSimplifiedEpisode = {
  href: string;
  items: SimplifiedEpisode[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
};

export type PagingPlaylistItem = {
  href: string;
  items: PlaylistItem[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
};

export type PlayHistory = {
  track: Track;
  played_at: string;
  context: Context | null;
};

export type Playlist = {
  collaborative: boolean;
  description: string | null;
  external_urls: ExternalURL;
  followers: Followers;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  owner: PublicUser;
  primary_color?: string | null;
  public: boolean | null;
  snapshot_id: string;
  tracks: PagingPlaylistItem;
  type: 'playlist';
  uri: string;
};

export type PlaylistDetails = {
  name?: string;
  public?: boolean;
  collaborative?: boolean;
  description?: string;
};

export type PlaylistItem = {
  added_at: string | null;
  added_by: PublicUser | null;
  is_local: boolean;
  primary_color?: string | null;
  track: Track | Episode;
  video_thumbnail?: VideoThumbnail;
};

export type PrivateUser = {
  birthdate?: string;
  country?: string;
  display_name: string | null;
  email?: string;
  explicit_content?: ExplicitContent;
  external_urls: ExternalURL;
  followers: Followers;
  href: string;
  id: string;
  images: SpotifyImage[];
  product?: string;
  type: 'user';
  uri: string;
};

export type PublicUser = {
  display_name?: string | null;
  external_urls: ExternalURL;
  followers?: Followers;
  href: string;
  id: string;
  images?: SpotifyImage[];
  type: 'user';
  uri: string;
};

export type RecommendationSeed = {
  afterFilteringSize: number;
  afterRelinkingSize: number;
  href: string | null;
  id: string;
  initialPoolSize: number;
  type: 'artist' | 'ARTIST' | 'track' | 'TRACK' | 'genre' | 'GENRE';
};

export type RegularError = {
  error: {
    status: number;
    message: string;
  };
};

export type RepeatState = 'track' | 'context' | 'off';

export type ResumePoint = {
  fully_played: boolean;
  resume_position_ms: number;
};

export type Restrictions = {
  reason: string;
};

export type SavedAlbum = {
  added_at: string;
  album: Album;
};

export type SavedShow = {
  added_at: string;
  show: SimplifiedShow;
};

export type SavedTrack = {
  added_at: string;
  track: Track;
};

export type SearchType =
  | 'album'
  | 'artist'
  | 'playlist'
  | 'track'
  | 'show'
  | 'episode';

export type Section = {
  start: number;
  duration: number;
  confidence: number;
  loudness: number;
  tempo: number;
  tempo_confidence: number;
  key: number;
  key_confidence: number;
  mode: number;
  mode_confidence: number;
  time_signature: number;
  time_signature_confidence: number;
};

export type Segment = {
  start: number;
  duration: number;
  confidence: number;
  loudness_start: number;
  loudness_max: number;
  loudness_max_time: number;
  loudness_end: number;
  pitches: number[];
  timbre: number[];
};

export type Show = {
  available_markets: string[];
  copyrights: Copyright[];
  description: string;
  explicit: boolean;
  episodes: PagingSimplifiedEpisode;
  external_urls: ExternalURL;
  href: string;
  id: string;
  images: SpotifyImage[];
  is_externally_hosted: boolean | null;
  languages: string[];
  media_type: string;
  name: string;
  publisher: string;
  type: 'show';
  uri: string;
};

export type SimplifiedAlbum = {
  album_group?: 'album' | 'single' | 'compilation' | 'appears_on';
  album_type:
    | 'album'
    | 'ALBUM'
    | 'single'
    | 'SINGLE'
    | 'compilation'
    | 'COMPILATION';
  artists: SimplifiedArtist[];
  available_markets?: string[];
  external_urls: ExternalURL;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  release_date_precision: 'year' | 'month' | 'day';
  restrictions?: Restrictions;
  total_tracks: number;
  type: 'album';
  uri: string;
};

export type SimplifiedArtist = {
  external_urls: ExternalURL;
  href: string;
  id: string;
  name: string;
  type: 'artist';
  uri: string;
};

export type SimplifiedEpisode = {
  audio_preview_url: string | null;
  description: string;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalURL;
  href: string;
  id: string;
  images: SpotifyImage[];
  is_externally_hosted: boolean;
  is_playable: boolean;
  language?: string;
  languages: string[];
  name: string;
  release_date: string;
  release_date_precision: 'year' | 'month' | 'day';
  resume_point?: ResumePoint;
  type: 'episode';
  uri: string;
};

export type SimplifiedPlaylist = {
  collaborative: boolean;
  description: string | null;
  external_urls: ExternalURL;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  owner: PublicUser;
  primary_color: string | null;
  public: boolean | null;
  snapshot_id: string;
  tracks: Tracks;
  type: 'playlist';
  uri: string;
};

export type SimplifiedShow = {
  available_markets: string[];
  copyrights: Copyright[];
  description: string;
  explicit: boolean;
  external_urls: ExternalURL;
  href: string;
  id: string;
  images: SpotifyImage[];
  is_externally_hosted: boolean | null;
  languages: string[];
  media_type: string;
  name: string;
  publisher: string;
  type: 'show';
  uri: string;
};

export type SimplifiedTrack = {
  artists: SimplifiedArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalURL;
  href: string;
  id: string;
  is_playable?: boolean;
  linked_from?: TrackLink;
  restrictions?: Restrictions;
  name: string;
  preview_url: string;
  track_number: number;
  type: 'track';
  uri: string;
  is_local: boolean;
};

export type SpotifyImage = {
  height: number | null;
  url: string;
  width: number | null;
};

export type TimeInterval = {
  start: number;
  duration: number;
  confidence: number;
};

export type Track = {
  album: SimplifiedAlbum;
  artists: SimplifiedArtist[];
  available_markets?: string[];
  disc_number: number;
  duration_ms: number;
  episode?: boolean;
  explicit: boolean;
  external_ids: ExternalID;
  external_urls: ExternalURL;
  href: string;
  id: string;
  is_playable?: boolean;
  linked_from?: TrackLink;
  restrictions?: Restrictions;
  name: string;
  popularity: number;
  preview_url: string | null;
  track?: boolean;
  track_number: number;
  type: 'track';
  uri: string;
  is_local: boolean;
};

export type TrackLink = {
  external_urls: ExternalURL;
  href: string;
  id: string;
  type: 'track';
  uri: string;
};

export type Tracks = {
  href: string;
  total: number;
};

export type VideoThumbnail = {
  url: string | null;
};
