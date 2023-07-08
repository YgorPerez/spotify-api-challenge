import { Button } from '@components/ui/Button';
import Skeleton from '@components/ui/Skeleton';
import { api } from '@utils/api';
import formatText from '@utils/formatText';
import Link from 'next/link';
import { type FC } from 'react';
import { type SimplifiedTrack as SimplifiedTrackType } from 'spotify-web-api-ts-edge/types/types/SpotifyObjects';
import { useMediaQuery } from 'usehooks-ts';
import formatMilliseconds from '../../utils/formatMilliseconds';

const Track: FC<{ track: SimplifiedTrackType | null }> = ({ track }) => {
  const utils = api.useContext();
  const isXs = useMediaQuery('(max-width: 640px)');
  const isXl = useMediaQuery('(max-width: 1536px)');
  let textLength;
  if (isXs) {
    textLength = 28;
  } else if (isXl) {
    textLength = 45;
  } else {
    textLength = 70;
  }

  const prefetchTrack = (track: SimplifiedTrackType) => {
    void utils.spotify.getTrack.prefetch({
      trackId: track.id,
    });
    void utils.spotify.getSongLyrics.prefetch({
      artistName: track.artists[0]?.name as string,
      songTitle: track.name,
    });
  };

  if (!track) {
    return (
      <li className='sm:text-lg lg:ml-8 2xl:text-2xl'>
        <div className='my-3 flex w-screen justify-between lg:max-w-xs xl:max-w-xl 2xl:mb-[1.125rem] 2xl:max-w-5xl'>
          <Skeleton className='h-4 w-[60ch] lg:ml-4 2xl:h-5' />
          <Skeleton className='h-4 w-[4ch] lg:mr-4 2xl:h-5' />
        </div>
      </li>
    );
  }
  return (
    <Button asChild variant='link'>
      <Link
        href={`/track/${track.id}`}
        onFocus={() => {
          prefetchTrack(track);
        }}
        onMouseEnter={() => {
          prefetchTrack(track);
        }}
      >
        <li className='ml-3 text-center text-base marker:!text-light-gray sm:text-xl md:text-2xl lg:text-xl xl:ml-4 2xl:text-2xl'>
          <div className='flex w-[85vw] justify-between py-1 lg:max-w-lg xl:max-w-2xl 2xl:mb-1 2xl:max-w-5xl'>
            <h2 className='ml-2 text-white-gray lg:ml-4'>
              {formatText(track.name, textLength)}
            </h2>
            <span className='text-light-gray lg:mr-4'>
              {formatMilliseconds({ milliseconds: track.duration_ms })}
            </span>
          </div>
        </li>
      </Link>
    </Button>
  );
};

export default Track;
