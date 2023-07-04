import { api } from '@utils/api'

export default function useGetArtist(artistId: string) {
  return api.spotify.getArtist.useQuery(
    {
      artistId,
    },
    {
      staleTime: Infinity,
    },
  )
}
