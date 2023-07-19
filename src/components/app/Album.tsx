import Skeleton from '@components/ui/Skeleton';
import type { SimplifiedAlbumType } from '@schema/spotifyApiSchemas';
import { api } from '@utils/api';
import Link from 'next/link';
import { type FC } from 'react';

const Album: FC<{ album: SimplifiedAlbumType | null }> = ({ album }) => {
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
      <li
        className='ml-8 w-[85vw] py-1 text-center text-lg lg:w-[55vw] 2xl:mb-1 2xl:text-2xl'
        data-cy='album-skeleton'
      >
        <Skeleton className='mb-3 ml-4 h-4 w-[calc(100vw_-_6rem)] lg:w-[calc(55vw_-_4rem)] 2xl:mb-[0.575rem] 2xl:h-6' />
      </li>
    );
  }
  return (
    <li
      className='ml-8 mr-4 marker:!text-primary-foreground sm:ml-12 sm:text-lg 2xl:text-2xl'
      data-cy='album'
    >
      <Link
        href={`/album/${album.id}`}
        className=' underline-offset-4 hover:underline'
        onFocus={() => prefetchAlbum(album.id)}
        onMouseEnter={() => prefetchAlbum(album.id)}
      >
        <div className='py-1 text-base sm:text-lg 2xl:mb-1 2xl:text-2xl'>
          <h2
            className='ml-4 line-clamp-1 overflow-hidden text-ellipsis'
            data-cy='album-name'
          >
            {album.name}
          </h2>
        </div>
      </Link>
    </li>
  );
};

export default Album;
