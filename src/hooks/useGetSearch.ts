import { api } from '../utils/api'

export default function useGetSearch({
  searchTerm,
  enabled = true,
  limit = 5,
}: {
  searchTerm: string
  enabled?: boolean
  limit?: number
}) {
  const utils = api.useContext()
  return api.spotify.getSearch.useInfiniteQuery(
    {
      searchTerm,
      limit,
    },
    {
      enabled,
      getNextPageParam: lastPage => lastPage.nextCursor,
      staleTime: Infinity,
      onSuccess(data) {
        data.pages.flatMap(page => {
          page.albums?.map(album => {
            utils.spotify.getAlbum.setData(
              { albumId: album.id },
              { album: album },
            )
          })
          page.artists?.map(artist => {
            utils.spotify.getArtist.setData(
              { artistId: artist.id },
              { artist: artist },
            )
          })
          page.tracks?.map(track => {
            utils.spotify.getTrack.setData(
              { trackId: track.id },
              { track: track },
            )
          })
        })
      },
    },
  )
}
