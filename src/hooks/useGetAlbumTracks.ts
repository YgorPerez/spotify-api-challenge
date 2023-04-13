/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useMemo } from 'react'
import { api } from '../utils/api'

function generateFakeTracks(amount: number) {
  const fakeCards = { tracks: [null], nextCursor: undefined }
  for (let i = 1; i < amount; i++) {
    fakeCards.tracks.push(null)
  }
  return { pageParams: [undefined], pages: [fakeCards] }
}

export default function useGetAlbumTracks({
  albumId,
  enabled = true,
  placeholderAmount = 15,
  limit = 15
}: {
  albumId: string
  enabled?: boolean
  placeholderAmount?: number,
  limit?: number
}) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const placeholderData = useMemo(() => generateFakeTracks(placeholderAmount), [])
  return api.spotify.getAlbumTracks.useInfiniteQuery(
    {
      albumId,
      limit
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      placeholderData,
      staleTime: Infinity,
      enabled,
    },
  )
}
