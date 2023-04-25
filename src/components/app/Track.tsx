import Skeleton from '@components/ui/Skeleton'
import formatText from '@utils/formatText'
import Link from 'next/link'
import React from 'react'
import {
  type SimplifiedTrack as SimplifiedTrackType,
  type Track as TrackType,
} from 'spotify-web-api-ts-edge/types/types/SpotifyObjects'
import formatMilliseconds from '../../utils/formatMilliseconds'

const Track: React.FC<{ track: SimplifiedTrackType | TrackType | null }> = ({
  track,
}) => {
  if (!track) {
    return (
      <li className='marker:content-[counter(list-item) "."] ml-4 text-center text-lg 2xl:text-2xl'>
        <div className='flex w-screen justify-between md:max-w-xs xl:max-w-xl mb-3 2xl:mb-[1.125rem] 2xl:max-w-5xl'>
        <Skeleton className='ml-4 h-4 w-[60ch] 2xl:h-6' />
          <Skeleton className='h-4 w-[4ch] 2xl:h-6' />
        </div>
      </li>    )
  }
  return (
    <Link href={`/track/${track.id}`}>
      <li className='marker:content-[counter(list-item) "."] ml-4 text-center text-lg 2xl:text-2xl'>
        <div className='flex w-screen justify-between py-1 md:max-w-xs xl:max-w-xl 2xl:mb-1 2xl:max-w-5xl'>
          <h2 className='ml-4 text-white-gray'>{formatText(track.name, 60)}</h2>
          <span className='text-light-gray'>
            {formatMilliseconds({ milliseconds: track.duration_ms })}
          </span>
        </div>
      </li>
    </Link>
  )
}

export default Track
