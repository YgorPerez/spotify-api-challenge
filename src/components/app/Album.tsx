import Link from 'next/link'
import React from 'react'
import { type SimplifiedAlbum as AlbumType } from 'spotify-web-api-ts-edge/types/types/SpotifyObjects'

const Album: React.FC<{ album: AlbumType | null }> = ({ album }) => {
  if (!album) {
    return (
      <li className='py-1 text-center text-lg 2xl:mb-1 2xl:text-2xl'>
        <div
          className='ml-4 flex w-screen justify-between md:max-w-xs xl:max-w-xl 2xl:max-w-5xl'
        >
          <h2 className='text-white-gray'>Loading...</h2>
        </div>
      </li>
    )
  }
  return (
    <li className='py-1 text-center text-lg 2xl:mb-1 2xl:text-2xl'>
      <Link
        href={`/album/${album.id}`}
        className='ml-4 flex w-screen justify-between md:max-w-xs xl:max-w-xl 2xl:max-w-5xl'
      >
        <h2 className='text-white-gray'>{album.name}</h2>
      </Link>
    </li>
  )
}

export default Album
