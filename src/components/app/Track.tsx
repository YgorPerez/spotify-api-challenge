import Skeleton from '@components/ui/Skeleton'
import { api } from '@utils/api'
import formatText from '@utils/formatText'
import Link from 'next/link'
import { type FC } from 'react'
import {
  type SimplifiedTrack as SimplifiedTrackType,
} from 'spotify-web-api-ts-edge/types/types/SpotifyObjects'
import formatMilliseconds from '../../utils/formatMilliseconds'

const Track: FC<{ track: SimplifiedTrackType | null }> = ({
  track,
}) => {
  const utils = api.useContext()
  const prefetchTrack = (track: SimplifiedTrackType) => {
    void utils.spotify.getTrack.prefetch({
      trackId: track.id,
    })
    void utils.spotify.getSongLyrics.prefetch({
      artistName: track.artists[0]?.name as string,
      songTitle: track.name,
    })
  }

  if (!track) {
    return (
      <li className='ml-8 text-lg 2xl:text-2xl'>
        <div className='my-3 flex w-screen justify-between md:max-w-xs xl:max-w-xl 2xl:mb-[1.125rem] 2xl:max-w-5xl'>
          <Skeleton className='ml-4 h-4 w-[60ch] 2xl:h-5' />
          <Skeleton className='mr-4 h-4 w-[4ch] 2xl:h-5' />
        </div>
      </li>
    )
  }
  return (
    <Link
      href={`/track/${track.id}`}
      onFocus={() => {prefetchTrack(track)}}
      onMouseEnter={() => {prefetchTrack(track)}}
    >
      <li className='before:content-[counter(list-item) "."] ml-8 text-center text-lg 2xl:text-2xl'>
        <div className='flex w-screen justify-between py-1 md:max-w-xs xl:max-w-xl 2xl:mb-1 2xl:max-w-5xl'>
          <h2 className='ml-4 text-white-gray'>{formatText(track.name, 70)}</h2>
          <span className='mr-4 text-light-gray'>
            {formatMilliseconds({ milliseconds: track.duration_ms })}
          </span>
        </div>
      </li>
    </Link>
  )
}

export default Track
