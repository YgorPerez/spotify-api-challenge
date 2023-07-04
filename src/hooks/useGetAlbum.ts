import { api } from '@utils/api'

export default function useGetAlbum(albumId: string) {
  return api.spotify.getAlbum.useQuery(
    { albumId },
    {
      staleTime: Infinity,
    },
  )
}
