import { api } from '../utils/api'

export default function useGetAlbumTracks({
  albumId,
  enabled = true,
  limit = 15,
}: {
  albumId: string
  enabled?: boolean
  limit?: number
}) {
  const utils = api.useContext()

  return api.spotify.getAlbumTracks.useInfiniteQuery(
    {
      albumId,
      limit,
    },
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
      staleTime: Infinity,
      enabled,
      keepPreviousData: true,
      onSuccess(data) {
        const nextCursor = data.pages[data.pages.length - 1]?.nextCursor
        nextCursor &&
          void utils.spotify.getAlbumTracks.prefetchInfinite({
            albumId,
            limit,
            cursor: nextCursor,
          })
      },
    },
  )
}
