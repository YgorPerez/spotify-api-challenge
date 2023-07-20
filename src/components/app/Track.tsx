import Skeleton from '@components/ui/Skeleton';
import { type SimplifiedTrackType } from '@schema/spotifyApiSchemas';
import { api } from '@utils/api';
import formatMilliseconds from '@utils/formatMilliseconds';
import Link from 'next/link';
import { type FC } from 'react';

const Track: FC<{ track: SimplifiedTrackType | null }> = ({ track }) => {
  const utils = api.useContext();

  const prefetchTrack = (track: SimplifiedTrackType) => {
    void utils.spotify.getTrack.prefetch({
      trackId: track.id,
    });
    void utils.lyrics.getSongLyrics.prefetch({
      artistName: track.artists[0]?.name as string,
      songTitle: track.name,
    });
  };

  if (!track) {
    return (
      <li
        className='my-4 ml-8 text-base sm:text-xl 2xl:text-2xl'
        data-cy='track-skeleton'
      >
        <div className='flex w-[85vw] justify-between lg:w-[55vw] 2xl:mb-[1.125rem]'>
          <Skeleton className='ml-4 h-4 w-[28ch] sm:w-[40ch] lg:w-[50ch] xl:w-[60ch] 2xl:h-5' />
          <Skeleton className='h-4 w-[4ch] lg:mr-4 2xl:h-5' />
        </div>
      </li>
    );
  }
  return (
    <li
      className='ml-8 text-base marker:!text-primary-foreground sm:text-lg 2xl:text-2xl'
      data-cy='track'
    >
      <Link
        className='underline-offset-4 hover:underline lg:inline-block 2xl:my-1'
        href={`/track/${track.id}`}
        onFocus={() => {
          prefetchTrack(track);
        }}
        onMouseEnter={() => {
          prefetchTrack(track);
        }}
      >
        <div className='text-base sm:text-lg 2xl:text-2xl'>
          <div className='flex w-[85vw] justify-between py-1 lg:w-[55vw]'>
            <h2 className='mx-2 line-clamp-1 sm:mr-4' data-cy='track-name'>
              {track.name}
            </h2>
            <span
              className='text-primary-foreground lg:mr-4'
              data-cy='track-duration'
            >
              {formatMilliseconds({ milliseconds: track.duration_ms })}
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default Track;
