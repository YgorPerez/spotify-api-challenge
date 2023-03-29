import { api } from '../utils/api'

export default function useGetSearch({
  searchTerm,
  enabled = true,
  placeholderAmount = 20,
}: {
  searchTerm: string
  enabled?: boolean
  placeholderAmount?: number
}) {
  // const utils = api.useContext()
  const placeholderData = { albums: [{ album: null }] }
  for (let i = 1; i < placeholderAmount; i++) {
    placeholderData.albums.push({ album: null })
  }
  return api.spotify.getSearch.useQuery(
    {
      searchTerm,
    },
    {
      cacheTime: Infinity,
      enabled,
      staleTime: Infinity,
      placeholderData,
      // onSuccess(searchSuccessdata) {
      // searchSuccessdata.albums?.map(album => {
      //   utils.spotify.getAlbumTracks.prefetch({ albumId: album.id })
      // })
      // searchSuccessdata.tracks?.map(track => {
      //   utils.spotify.getTrack.setData({ trackId: track.id }, track)
      // })
      // },
    },
  )
}
