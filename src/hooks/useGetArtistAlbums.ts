import { api } from '../utils/api'

export default function useGetArtistsAlbums({
  artistId,
  enabled = true,
  limit = 20,
}: {
  artistId: string
  enabled?: boolean
  limit?: number
}) {
  const utils = api.useContext()

  return api.spotify.getArtistAlbums.useInfiniteQuery(
    {
      artistId,
      limit,
    },
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
      staleTime: Infinity,
      enabled,
      keepPreviousData: true,
      onSuccess(data) {
        data.pages.flatMap(page => {
          page.albums?.map(album => {
            utils.spotify.getAlbum.setData(
              { albumId: album.id },
              { album: album },
            )
          })
        })
        const nextCursor = data.pages[data.pages.length - 1]?.nextCursor
        nextCursor &&
          void utils.spotify.getArtistAlbums.prefetchInfinite({
            artistId,
            limit,
            cursor: nextCursor,
          })
      },
    },
  )
}
