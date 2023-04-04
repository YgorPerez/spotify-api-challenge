export interface SearchContent {
  tracks?: Track[]
  artists?: Artist[]
  albums?: Album[]
}

interface Copyright {
  text: string
  type: 'C' | 'P'
}

interface TrackLink {
  external_urls: ExternalUrl
  href: string
  id: string
  type: 'track'
  uri: string
}

export interface Track extends SimplifiedTrack {
  album: SimplifiedAlbum
  external_ids: ExternalId
  popularity: number
  is_local?: boolean | undefined
}

export interface SimplifiedTrack {
  artists: SimplifiedArtist[]
  available_markets?: string[] | undefined
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_urls: ExternalUrl
  href: string
  id: string
  is_playable?: boolean | undefined
  linked_from?: TrackLink | undefined
  restrictions?: Restrictions | undefined
  name: string
  preview_url: string | null
  track_number: number
  type: 'track'
  uri: string
}

interface SimplifiedArtist extends ContextObject {
  name: string
  id: string
  type: 'artist'
}

interface Followers {
  href: null
  total: number
}

export interface Image {
  height?: number | undefined
  url: string
  width?: number | undefined
}

interface ContextObject {
  type: 'artist' | 'playlist' | 'album' | 'show' | 'episode'
  href: string
  external_urls: ExternalUrl
  uri: string
}

export interface Artist extends SimplifiedArtist {
  followers: Followers
  genres: string[]
  images: Image[]
  popularity: number
}

interface ExternalId {
  isrc?: string | undefined
  ean?: string | undefined
  upc?: string | undefined
}

export interface ExternalUrl {
  spotify: string
}

export interface LinkedTrack {
  external_urls: ExternalUrl
  id: string
  type: SpotifyType
  uri: string
}

interface Restrictions {
  reason: string
}
export type SearchType = 'album' | 'artist' | 'track' | 'show' | 'episode'

export type SpotifyType =
  | 'user'
  | 'episode'
  | 'playlist'
  | 'show'
  | 'track'
  | 'album'
  | 'artist'

interface Paging<T> {
  href: string
  items: T[]
  limit: number
  next: string | null
  offset: number
  previous: string | null
  total: number
}

export interface SimplifiedAlbum extends ContextObject {
  album_group?: 'album' | 'single' | 'compilation' | 'appears_on' | undefined
  album_type: 'album' | 'single' | 'compilation'
  artists: SimplifiedArtist[]
  available_markets?: string[] | undefined
  id: string
  images: Image[]
  name: string
  release_date: string
  release_date_precision: 'year' | 'month' | 'day'
  restrictions?: Restrictions | undefined
  type: 'album'
  total_tracks: number
}

export type AlbumType = 'single' | 'album' | 'compilation'

export interface Album extends SimplifiedAlbum {
  copyrights: Copyright[]
  external_ids: ExternalId
  genres: string[]
  label: string
  popularity: number
  tracks: Paging<SimplifiedTrack>
}
