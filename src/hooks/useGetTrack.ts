import { api } from '@utils/api'

export default function useGetArtistsAlbums(trackId: string) {
  return api.spotify.getTrack.useQuery(
    { trackId },
    {
      staleTime: Infinity,
    },
  )
}
