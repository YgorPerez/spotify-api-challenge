export type AlbumGroup = AlbumType | 'appears_on'

export interface SimplifiedAlbum {
  albumGroup?: AlbumGroup
  albumType: AlbumType
  artists: SimplifiedArtist[]
  availableMarkets?: string[]
  externalURL: ExternalUrl
  href: string
  id: string
  images: Image[]
  name: string
  releaseDate: string
  releaseDatePrecision: string
  restrictions: Restriction[]
  totalTracks: number
  type: SpotifyType
  uri: string
}

export interface SimplifiedTrack {
  artists: SimplifiedArtist[]
  availableMarkets?: string[]
  discNumber: number
  duration: number
  explicit: boolean
  externalURL: ExternalUrl
  href?: string
  id: string
  isLocal: boolean
  isPlayable?: boolean
  linkedFrom?: LinkedTrack
  name: string
  previewURL: string | null
  restrictions: Restriction[]
  trackNumber: number
  type: SpotifyType
  uri: string
}

export interface SimplifiedArtist {
  externalURL: ExternalUrl
  id: string
  name: string
  type: SpotifyType
  uri: string
}

export interface SearchContent {
  tracks?: Track[]
  artists?: Artist[]
  albums?: SimplifiedAlbum[]
}

export interface Track extends SimplifiedTrack {
  album?: SimplifiedAlbum
  externalID?: ExternalID
  popularity?: number
}

export interface Artist extends SimplifiedArtist {
  totalFollowers?: number
  genres?: string[]
  images?: Image[]
  popularity?: number
}

export interface ExternalID {
  ean?: string | undefined
  isrc?: string | undefined
  upc?: string | undefined
}

export interface ExternalUrl {
  spotify: string
}

export interface Image {
  height: number | null
  url: string
  width: number | null
}

export interface LinkedTrack {
  externalURL: ExternalUrl
  id: string
  type: SpotifyType
  uri: string
}

export interface Copyright {
  text: string
  type: 'C' | 'P'
}

export type Restriction =
  | {
      reason: 'market' | 'product' | 'explicit'
    }
  | undefined

export type SearchType = 'album' | 'artist' | 'track' | 'show' | 'episode'

export type SpotifyType =
  | 'user'
  | 'episode'
  | 'playlist'
  | 'show'
  | 'track'
  | 'album'
  | 'artist'

export type AlbumType = 'single' | 'album' | 'compilation'

export interface Album extends SimplifiedAlbum {
  copyrights?: Copyright[]
  externalID?: ExternalID
  genres?: string[]
  label?: string
  popularity?: number
  tracks?: SimplifiedTrack[]
}
