import Skeleton from '@components/ui/Skeleton'
import formatText from '@utils/formatText'
import Link from 'next/link'
import { FC } from 'react'
import { type SimplifiedAlbum as AlbumType } from 'spotify-web-api-ts-edge/types/types/SpotifyObjects'

const Album: FC<{ album: AlbumType | null }> = ({ album }) => {
  if (!album) {
    return (
      <div className='ml-8 flex w-screen items-center justify-between md:max-w-xs xl:max-w-xl 2xl:max-w-5xl'>
        <li className='marker:content-[counter(list-item) "."] py-1 text-center text-lg 2xl:mb-1 2xl:text-2xl'>
          <Skeleton className='mb-1 ml-4 h-4 w-[70ch] 2xl:mb-[0.575rem] 2xl:h-6' />
        </li>
      </div>
    )
  }
  return (
    <Link
      href={`/album/${album.id}`}
      className='ml-8 flex w-screen justify-between md:max-w-xs xl:max-w-xl 2xl:max-w-5xl'
    >
      <li className='marker:content-[counter(list-item) "."] py-1 text-center text-lg 2xl:mb-1 2xl:text-2xl'>
        <h2 className='ml-4 text-white-gray'>{formatText(album.name, 90)}</h2>
      </li>
    </Link>
  )
}

export default Album
