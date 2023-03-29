import { log } from 'next-axiom'
import Image from 'next/image'
import Link from 'next/link'
import cardPlaceholderImage from 'public/images/gray-square-placeholder.jpg'
import React from 'react'
import type {
  Album as AlbumType,
  Artist as ArtistType,
  Image as ImageType,
  Track as TrackType,
} from 'spotify-api.js'

type CardData = AlbumType | TrackType | ArtistType | null

type CardMainData = {
  images: ImageType[] | null
  slugUrl: string
} | null

const CardMain: React.FC<{
  cardMainData: CardMainData
  cardData: CardData
  big?: boolean
}> = ({ cardMainData = null, cardData = null, big = false }) => {
  const imageSize = big ? 600 : 288
  if (big) {
    return (
      <>
        <div className='flex justify-center'>
          <Image
            src={cardMainData?.images?.[0]?.url || cardPlaceholderImage}
            alt='album cover'
            width={imageSize}
            height={imageSize}
            className='h-full w-full'
          />
        </div>
      </>
    )
  }
  return (
    <>
      <Image
        className='aspect-square'
        src={cardMainData?.images?.[0]?.url || cardPlaceholderImage}
        blurDataURL={'public/images/gray-square-placeholder.jpg'}
        alt='album cover'
        height={imageSize}
        width={imageSize}
      />
      <p className='pt-4 pb-1 text-2xl text-white-gray'>
        {cardData?.name || 'loading...'}
      </p>
    </>
  )
}

const ImageCard: React.FC<{
  cardData: CardData
  big?: boolean
}> = ({ cardData = null, big = false }) => {
  //iife
  const { cardMainData, cardSubData } = (() => {
    if (cardData) {
      // Handle album data
      if ('albumType' in cardData) {
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
      if ('trackNumber' in cardData) {
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
      if ('totalFollowers' in cardData) {
        return {
          cardMainData: {
            images: cardData.images || null,
            slugUrl: 'albums',
          },
          cardSubData: null,
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
        <CardMain cardMainData={cardMainData} cardData={cardData} big={true} />
        <div className='pt-4'>
          <h1 className=' text-3xl text-white-gray 2xl:text-4xl'>
            {cardData.name || 'loading...'}
          </h1>
          <Link
            href={cardData ? `/${cardSubData.slugUrl}/${cardSubData.id}` : '#'}
          >
            <h2 className='pt-1 text-xl text-light-gray 2xl:text-2xl'>
              {cardSubData.name}
            </h2>
          </Link>
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
      {cardSubData && (
        <Link
          href={cardData ? `/${cardSubData.slugUrl}/${cardSubData.id}` : '#'}
          className='pt-2 text-xl text-light-gray'
        >
          {cardSubData.name}
        </Link>
      )}
    </div>
  )
}

export default ImageCard
