import Skeleton from '@components/ui/Skeleton';
import { api } from '@utils/api';
import Link from 'next/link';
import { type FC } from 'react';
import { type SimplifiedAlbum as AlbumType } from 'spotify-web-api-ts-edge/types/types/SpotifyObjects';

const Album: FC<{ album: AlbumType | null }> = ({ album }) => {
  const utils = api.useContext();

  const prefetchAlbum = (albumId: string) => {
    void utils.spotify.getAlbum.prefetch({
      albumId,
    });
    void utils.spotify.getAlbumTracks.prefetchInfinite({
      albumId,
    });
  };

  if (!album) {
    return (
      <li className='ml-8 w-[85vw] py-1 text-center text-lg lg:w-[55vw] 2xl:mb-1 2xl:text-2xl'>
        <Skeleton className='mb-3 ml-4 h-4 w-[calc(100vw_-_6rem)] lg:w-[calc(55vw_-_4rem)] 2xl:mb-[0.575rem] 2xl:h-6' />
      </li>
    );
  }
  return (
    <Link
      href={`/album/${album.id}`}
      className='inline-block w-[95vw] whitespace-nowrap underline-offset-4 hover:underline lg:w-[55vw]'
      onFocus={() => prefetchAlbum(album.id)}
      onMouseEnter={() => prefetchAlbum(album.id)}
    >
      <li className='ml-8 mr-4 py-1 text-base marker:text-center marker:!text-primary-foreground sm:ml-12 sm:text-lg 2xl:mb-1 2xl:text-2xl'>
        <h2 className='ml-4 overflow-hidden text-ellipsis text-foreground'>
          {album.name}
        </h2>
      </li>
    </Link>
  );
};

export default Album;
