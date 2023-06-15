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
  return api.spotify.getAlbumTracks.useInfiniteQuery(
    {
      albumId,
      limit,
    },
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
      staleTime: Infinity,
      enabled,
    },
  )
}
