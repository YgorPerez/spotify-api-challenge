import { Button } from '@components/ui/Button';
import Skeleton from '@components/ui/Skeleton';
import { api } from '@utils/api';
import formatText from '@utils/formatText';
import Link from 'next/link';
import { type FC } from 'react';
import { type SimplifiedAlbum as AlbumType } from 'spotify-web-api-ts-edge/types/types/SpotifyObjects';
import { useMediaQuery } from 'usehooks-ts';

const Album: FC<{ album: AlbumType | null }> = ({ album }) => {
  const utils = api.useContext();
  const isSmallerSM = useMediaQuery('(max-width: 639px)');
  const isSmaller2XL = useMediaQuery('(max-width: 1535px)');
  let textLength;
  if (isSmallerSM) {
    textLength = 25;
  } else if (isSmaller2XL) {
    textLength = 70;
  } else {
    textLength = 80;
  }

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
    <Button asChild variant='link'>
      <Link
        href={`/album/${album.id}`}
        className='flex justify-between lg:w-[55vw]'
        onFocus={() => prefetchAlbum(album.id)}
        onMouseEnter={() => prefetchAlbum(album.id)}
      >
        <li className='mx-4 py-1 text-center text-lg marker:!text-light-gray 2xl:mb-1 2xl:text-2xl'>
          <h2 className='ml-4 text-white-gray'>
            {formatText(album.name, textLength)}
          </h2>
        </li>
      </Link>
    </Button>
  );
};

export default Album;
