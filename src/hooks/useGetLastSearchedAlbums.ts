import { api } from '@utils/api'
import { type SimplifiedAlbum } from 'spotify-web-api-ts-edge/types/types/SpotifyObjects'

export default function useGetLastSearchedAlbum(lastSearchTerm: string) {
  const utils = api.useContext()

  const lastSearchedPages = utils.spotify.getSearch.getInfiniteData({
    searchTerm: lastSearchTerm,
    limit: 15,
  })?.pages

  const lastSearchedAlbums: SimplifiedAlbum[] = []
  if (lastSearchedPages) {
    for (let i = lastSearchedPages.length - 1; i >= 0; i--) {
      if (lastSearchedPages[i]?.albums) {
        lastSearchedPages[i]?.albums?.map(album => {
          lastSearchedAlbums.push(album)
        })
      }
    }
  }
  return lastSearchedAlbums
}
