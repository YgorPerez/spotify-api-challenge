import Image from 'next/image'
import Link from 'next/link'
import albumPlaceholderImage from 'public/images/gray-square-placeholder.jpg'
import React from 'react'
import {
  Album as albumType,
  Artist as artistType,
  Image as imageType,
  Track as trackType
} from 'spotify-api.js'

type AlbumCardData = albumType | trackType | artistType | null

type TitleData =
  | {
      images: imageType[] | undefined
      slugUrl: string
    }
  | undefined

type SubtitleData =
  | {
      name: string | undefined | null
      id: string | undefined
      slugUrl: string
    }
  | undefined

const AlbumCard: React.FC<{
  albumCardData: AlbumCardData
}> = ({ albumCardData = null }) => {

  function getTitleAndSubtitleData(albumCardData: AlbumCardData) {
    let titleData: TitleData
    let subtitleData: SubtitleData

    if (albumCardData) {
      // Handle album data
      if ('albumType' in albumCardData) {
        titleData = { images: albumCardData.images, slugUrl: 'album' }
        subtitleData = {
          name: albumCardData.artists?.[0]?.name,
          id: albumCardData.artists?.[0]?.id,
          slugUrl: 'albums',
        }
      }

      // Handle track data
      if ('trackNumber' in albumCardData) {
        titleData = { images: albumCardData.album?.images, slugUrl: 'track' }
        subtitleData = {
          name: albumCardData.artists?.[0]?.name,
          id: albumCardData.artists?.[0]?.id,
          slugUrl: 'albums',
        }
      }

      // Handle artist data
      if ('totalFollowers' in albumCardData) {
        titleData = { images: albumCardData.images, slugUrl: 'albums' }
      }
    }
    return { titleData, subtitleData }
  }

    const { titleData, subtitleData } = getTitleAndSubtitleData(albumCardData)

  return (
    <div className='my-2 w-60 items-center justify-center text-center 2xl:w-72'>
      <Link
        href={
          albumCardData ? `/${titleData?.slugUrl}/${albumCardData.id}` : '#'
        }
      >
        <Image
          src={titleData?.images?.[0]?.url || albumPlaceholderImage}
          blurDataURL={'public/images/gray-square-placeholder.jpg'}
          alt='album cover'
          height={
            (titleData?.images?.[0]?.height as number) ||
            albumPlaceholderImage.height
          }
          width={
            (titleData?.images?.[0]?.width as number) ||
            albumPlaceholderImage.width
          }
          sizes='(max-width: 1535px) 240px,
              288px'
        />
        <p className='pt-4 pb-1 text-2xl text-white-gray'>
          {albumCardData?.name || 'loading...'}
        </p>
      </Link>
      {subtitleData && albumCardData && (
        <Link
          href={
            albumCardData
              ? `/${subtitleData?.slugUrl}/${subtitleData?.id}`
              : '#'
          }
          className='pt-2 text-xl text-light-gray'
        >
          {subtitleData?.name || 'loading...'}
        </Link>
      )}
    </div>
  )
}

export default AlbumCard
