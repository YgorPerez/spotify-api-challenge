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
      <div className='flex w-4/5 items-center justify-between lg:min-w-[28rem] lg:max-w-lg xl:ml-8 xl:min-w-[36rem] xl:max-w-2xl 2xl:min-w-[48rem] 2xl:max-w-5xl'>
        <li className='py-1 text-center text-lg 2xl:mb-1 2xl:text-2xl'>
          <Skeleton className='mb-1 ml-4 h-4 w-[70ch] 2xl:mb-[0.575rem] 2xl:h-6' />
        </li>
      </div>
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
