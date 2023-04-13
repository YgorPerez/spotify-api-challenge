/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useMemo } from 'react'
import { api } from '../utils/api'

function generateFakeSpotifyCards(amount: number) {
  const fakeCards = { albums: [null], tracks: [null], artists: [null], nextCursor: undefined }
  for (let i = 1; i < amount; i++) {
    fakeCards.albums.push(null)
    fakeCards.tracks.push(null)
    fakeCards.artists.push(null)
  }
  return fakeCards
}

export default function useGetSearch({
  searchTerm,
  enabled = true,
  placeholderAmount = 5,
  limit = 5
}: {
  searchTerm: string
  enabled?: boolean
  placeholderAmount?: number,
  limit?: number
}) {
  const utils = api.useContext()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const placeholderData = useMemo(() => generateFakeSpotifyCards(placeholderAmount), [])
  return api.spotify.getSearch.useInfiniteQuery(
    {
      searchTerm,
      limit
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      placeholderData: { pageParams: [undefined], pages: [placeholderData] },
      staleTime: Infinity,
      enabled,
      onSuccess(searchSuccessdata) {

        searchSuccessdata.pages.map((data) => {
          data.albums?.map(async album => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            album && await utils.spotify.getAlbumTracks.prefetch({ albumId: album.id })
          })
          data.artists?.map(async artist => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            artist && await utils.spotify.getArtistAlbums.prefetch({ artistId: artist.id })
          })
          data.tracks?.map(track => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            track && utils.spotify.getTrack.setData({ trackId: track.id }, { track: track })
          })
        })
      },
    },
  )
}
