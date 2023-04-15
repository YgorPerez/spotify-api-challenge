import { api } from '../utils/api'

export default function useGetArtistsAlbums({
  artistId,
  enabled = true,
  limit = 20
}: {
  artistId: string
  enabled?: boolean
  limit?: number
}) {
  const utils = api.useContext()

  return api.spotify.getArtistAlbums.useInfiniteQuery(
    {
      artistId,
      limit
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: Infinity,
      enabled,
      async onSuccess(data) {
        const promises: Promise<void>[] = []
        data.pages.flatMap(page => {
          page.albums?.map(album => {
            promises.push(utils.spotify.getAlbumTracks.prefetchInfinite({ albumId: album.id, limit: 15 }))
            utils.spotify.getAlbum.setData({ albumId: album.id }, { album: album })
          })
        })
        await Promise.all(promises)
      },
    },
  )
}
