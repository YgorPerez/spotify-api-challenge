import { api } from '../utils/api'

export default function useGetSearch({
  searchTerm,
  enabled = true,
  limit = 5
}: {
  searchTerm: string
  enabled?: boolean
  limit?: number
}) {
  const utils = api.useContext()

  return api.spotify.getSearch.useInfiniteQuery(
    {
      searchTerm,
      limit
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: Infinity,
      enabled,
      async onSuccess(data) {
        await utils.spotify.getSearch.prefetchInfinite({
          searchTerm,
          limit,
          cursor: data.pages[data.pages.length - 1]?.nextCursor
        })
        const promises: Promise<void>[] = []
        data.pages.flatMap(page => {
          page.albums?.map(album => {
            utils.spotify.getAlbum.setData({ albumId: album.id }, { album: album })
            promises.push(utils.spotify.getAlbumTracks.prefetchInfinite({ albumId: album.id, limit: 15 }))
          })
          page.artists?.map(artist => {
            utils.spotify.getArtist.setData({ artistId: artist.id }, { artist: artist })
            promises.push(utils.spotify.getArtistAlbums.prefetchInfinite({ artistId: artist.id, limit: 15 }))
          })
          page.tracks?.map(track => {
            utils.spotify.getTrack.setData({ trackId: track.id }, { track: track })
          })
        })
        await Promise.all(promises)
      },
    })
}
