import Link from 'next/link'
import React from 'react'
import { type Track as TrackType } from 'spotify-api.js'
import formatMilliseconds from '../utils/formatMilliseconds'

const Track: React.FC<{ track: TrackType }> = ({ track }) => {
  const trackDurationInReadableTime = formatMilliseconds({
    milliseconds: track.duration,
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
