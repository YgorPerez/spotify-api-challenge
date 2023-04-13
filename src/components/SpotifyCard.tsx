import { log } from 'next-axiom'
import Image from 'next/image'
import Link from 'next/link'
import loadingImagePlaceholder from 'public/images/gray-square-placeholder.jpg'
import React from 'react'
import artistPlaceholder from '../../public/images/artist-placeholder.jpg'
import type {
  Album as AlbumType,
  Artist as ArtistType,
  SpotifyImage as ImageType,
  SimplifiedAlbum as SimplifiedAlbumType,
  Track as TrackType,
} from 'spotify-web-api-ts-edge/types/types/SpotifyObjects'
import formatFollowers from '../utils/formatFollowers'

type CardData = AlbumType | TrackType | SimplifiedAlbumType | ArtistType | null

type CardMainData = {
  images: ImageType[] | null
  slugUrl: string
} | null

const CardMain: React.FC<{
  cardMainData: CardMainData
  cardData: CardData
  big?: boolean
}> = ({ cardMainData, cardData, big }) => {
  const imageSize = big ? 600 : 288
  const placeholderImage = () => {
    if (cardData && 'followers' in cardData) {
      return artistPlaceholder
    } else {
      return loadingImagePlaceholder
    }
  }
  return big ? (
    <>
      <div className='flex justify-center'>
        <Image
          src={cardMainData?.images?.[0]?.url || placeholderImage()}
          alt='album cover'
          width={imageSize}
          height={imageSize}
          className='h-full w-full'
        />
      </div>
    </>
  ) : (
    <>
      <Image
        className='aspect-square'
        src={cardMainData?.images?.[0]?.url || placeholderImage()}
        blurDataURL={'public/images/gray-square-placeholder.jpg'}
        alt='album cover'
        height={imageSize}
        width={imageSize}
      />
      <p className='pb-1 pt-4 text-2xl text-white-gray'>
        {cardData?.name || 'loading...'}
      </p>
    </>
  )
}

const SpotifyCard: React.FC<{
  cardData: CardData
  big?: boolean
}> = ({ cardData, big }) => {
  //iife
  const { cardMainData, cardSubData } = (() => {
    if (cardData) {
      // Handle album data
      if ('album_type' in cardData) {
        return {
          cardMainData: { images: cardData.images, slugUrl: 'album' },
          cardSubData: {
            name: cardData.artists?.[0]?.name as string,
            id: cardData.artists?.[0]?.id as string,
            slugUrl: 'albums',
          },
        }
      }
      // Handle track data
      if ('track_number' in cardData) {
        return {
          cardMainData: {
            images: cardData.album?.images || null,
            slugUrl: 'track',
          },
          cardSubData: {
            name: cardData.artists?.[0]?.name as string,
            id: cardData.artists?.[0]?.id as string,
            slugUrl: 'albums',
          },
        }
      }
      // Handle artist data
      if ('followers' in cardData) {
        return {
          cardMainData: {
            images: cardData.images || null,
            slugUrl: 'albums',
          },
          cardSubData: {
            name: `Followers: ${formatFollowers(cardData.followers.total || 0)}`,
          },
        }
      }
    }
    return { cardMainData: null, cardSubData: null }
  })()

  if ((cardMainData && !cardData) || (cardSubData && !cardData)) {
    const message = 'Sub or main has data while card data does not'
    console.error(message)
    log.error(message)
  }

  if (big && cardMainData && cardSubData && cardData) {
    return (
      <div className='my-2 items-center justify-center text-center md:max-w-[10rem] lg:max-w-xs 2xl:max-w-md'>
        <CardMain cardMainData={cardMainData} cardData={cardData} big />
        <div className='pt-4'>
          <h1 className=' text-3xl text-white-gray 2xl:text-4xl'>
            {cardData.name || 'loading...'}
          </h1>
          {cardSubData.slugUrl ? (
            <Link
              href={`/${cardSubData.slugUrl}/${cardSubData.id}`}
              className='pt-2 text-xl text-light-gray'
            >
              {cardSubData.name}
            </Link>
          ) : (
            <span className='pt-2 text-xl text-light-gray'>
              {cardSubData.name}
            </span>
          )}
        </div>
      </div>
    )
  }
  return (
    <div className='my-2 w-60 items-center justify-center text-center 2xl:w-72'>
      {cardData && cardMainData ? (
        <Link href={`/${cardMainData.slugUrl}/${cardData.id}`}>
          <CardMain cardMainData={cardMainData} cardData={cardData} />
        </Link>
      ) : (
        <CardMain cardMainData={cardMainData} cardData={cardData} />
      )}
      {cardSubData?.slugUrl ? (
        <Link
          href={`/${cardSubData.slugUrl}/${cardSubData.id}`}
          className='pt-2 text-xl text-light-gray'
        >
          {cardSubData.name}
        </Link>
      ) : (
        <span className='pt-2 text-xl text-light-gray'>
          {cardSubData?.name}
        </span>
      )}
    </div>
  )
}

export default SpotifyCard
