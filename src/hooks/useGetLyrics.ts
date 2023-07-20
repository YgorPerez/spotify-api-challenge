import { api } from '@utils/api';

export default function useGetArtistsAlbums({
  artistName,
  songTitle,
}: {
  artistName: string;
  songTitle: string;
}) {
  return api.lyrics.getSongLyrics.useQuery(
    {
      artistName,
      songTitle,
    },
    {
      staleTime: Infinity,
    },
  );
}
