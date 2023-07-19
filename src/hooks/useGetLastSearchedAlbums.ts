import { type SimplifiedAlbumType } from '@schema/spotifyApiSchemas';
import { api } from '@utils/api';

export default function useGetLastSearchedAlbum(lastSearchTerm: string) {
  const utils = api.useContext();

  const lastSearchedPages = utils.spotify.getSearch.getInfiniteData({
    searchTerm: lastSearchTerm,
    limit: 5,
  })?.pages;

  const lastSearchedAlbums: SimplifiedAlbumType[] = [];
  if (lastSearchedPages) {
    for (let i = lastSearchedPages.length - 1; i >= 0; i--) {
      if (lastSearchedPages[i]?.albums) {
        lastSearchedPages[i]?.albums?.map(album => {
          lastSearchedAlbums.push(album);
        });
      }
    }
  }
  return lastSearchedAlbums;
}
