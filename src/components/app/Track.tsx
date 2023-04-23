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
      <li className='py-1 text-center text-lg 2xl:mb-1 2xl:text-2xl'>
        <div className='ml-4 flex w-screen justify-between md:max-w-xs xl:max-w-xl 2xl:max-w-5xl'>
          <h2 className='text-white-gray'>Loading...</h2>
          <span className='text-light-gray'>0:00</span>
        </div>
      </li>
    )
  }
  const trackDurationInReadableTime = formatMilliseconds({
    milliseconds: track.duration_ms,
  })
  return (
    <li className='py-1 text-center text-lg 2xl:mb-1 2xl:text-2xl'>
      <Link
        href={`/track/${track.id}`}
        className='ml-4 flex w-screen justify-between md:max-w-xs xl:max-w-xl 2xl:max-w-5xl'
      >
        <h2 className='text-white-gray'>{track.name}</h2>
        <span className='text-light-gray'>{trackDurationInReadableTime}</span>
      </Link>
    </li>
  )
}

export default Track
