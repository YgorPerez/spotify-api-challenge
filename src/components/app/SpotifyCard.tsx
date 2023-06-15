import Skeleton from '@components/ui/Skeleton'
import { api } from '@utils/api'
import formatFollowers from '@utils/formatFollowers'
import formatText from '@utils/formatText'
import { log } from 'next-axiom'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import type {
  Album as AlbumType,
  Artist as ArtistType,
  SpotifyImage as ImageType,
  SimplifiedAlbum as SimplifiedAlbumType,
  Track as TrackType,
} from 'spotify-web-api-ts-edge/types/types/SpotifyObjects'
import artistFallBackImg from '/public/images/artist-placeholder.jpg'

type CardData = AlbumType | TrackType | SimplifiedAlbumType | ArtistType | null

type CardMainData = {
  images: ImageType[] | null
  slugUrl: string
} | null

const titleLength = 37
const subtitleLength = 30

const CardMain: React.FC<{
  cardMainData: CardMainData
  cardData: CardData
  big?: boolean
}> = ({ cardMainData, cardData, big }) => {
  const imageSize = big ? 600 : 288
  return big ? (
    <>
      {cardMainData ? (
        <div className='flex justify-center'>
          <Image
            src={cardMainData?.images?.[0]?.url || artistFallBackImg}
            alt={
              cardMainData?.images?.[0]?.url ? 'album cover' : 'artist picture'
            }
            loading='lazy'
            width={imageSize}
            height={imageSize}
            className='h-full w-full'
          />
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center'>
          <Skeleton className='h-full min-h-[240px] w-full min-w-[240px] rounded-none sm:min-h-[320px] sm:min-w-[320px] 2xl:min-h-[448px] 2xl:min-w-[448px]' />
          <div className='mb-2 mt-7 flex flex-col items-center'>
            <Skeleton className='h-7 w-[200px] sm:w-[250px]' />
            <Skeleton className='mt-5 h-5 w-[150px] sm:w-[200px]' />
          </div>
        </div>
      )}
    </>
  ) : (
    <>
      {cardMainData && cardData ? (
        <>
          <Image
            className='aspect-square'
            src={cardMainData.images?.[1]?.url || artistFallBackImg}
            loading='lazy'
            alt='album cover'
            height={imageSize}
            width={imageSize}
          />
          <p className='mb-1 mt-4 w-4/5 text-2xl text-white-gray'>
            {formatText(cardData.name, titleLength)}
          </p>
        </>
      ) : (
        <>
          <Skeleton className='min-h-[240px] min-w-[240px] rounded-none' />
          <div className='mb-1 mt-7 flex flex-col items-center'>
            <Skeleton className='h-4 w-[200px]' />
            <Skeleton className='mt-4 h-4 w-[150px]' />
          </div>
        </>
      )}
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
            name: formatText(
              cardData.artists?.[0]?.name as string,
              subtitleLength,
            ),
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
            name: formatText(
              cardData.artists?.[0]?.name as string,
              subtitleLength,
            ),
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
            name: `Followers: ${formatFollowers(
              cardData.followers.total || 0,
            )}`,
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

  const utils = api.useContext()
  const prefetchArtist = (artistId: string) => {
    void utils.spotify.getArtist.prefetch({ artistId })
    void utils.spotify.getArtistAlbums.prefetchInfinite({ artistId, limit: 15 })
  }

  if (big && cardMainData && cardSubData && cardData) {
    return (
      <div className='my-2 items-center justify-center text-center md:max-w-[10rem] lg:max-w-xs 2xl:max-w-md'>
        <CardMain cardMainData={cardMainData} cardData={cardData} big />
        <div className='mt-4 flex flex-col items-center'>
          <h1 className=' mb-2 w-4/5 text-3xl text-white-gray'>
            {formatText(cardData.name, titleLength)}
          </h1>
          {cardSubData.slugUrl ? (
            <Link
              href={`/${cardSubData.slugUrl}/${cardSubData.id}`}
              onFocus={() => prefetchArtist(cardSubData.id)}
              onMouseEnter={() => prefetchArtist(cardSubData.id)}
              className='text-2xl text-light-gray'
            >
              {cardSubData.name}
            </Link>
          ) : (
            <span className='text-2xl text-light-gray'>{cardSubData.name}</span>
          )}
        </div>
      </div>
    )
  }
  return (
    <>
      {cardData && cardMainData ? (
        <div className='my-2 w-60 items-center justify-center text-center 2xl:w-72'>
          <Link
            href={`/${cardMainData.slugUrl}/${cardData.id}`}
            className='flex flex-col items-center'
          >
            <CardMain cardMainData={cardMainData} cardData={cardData} />
          </Link>
          {cardSubData?.slugUrl ? (
            <Link
              href={`/${cardSubData.slugUrl}/${cardSubData.id}`}
              onFocus={() => prefetchArtist(cardSubData.id)}
              onMouseEnter={() => prefetchArtist(cardSubData.id)}
              className='mt-2 w-3/4 text-xl text-light-gray'
            >
              {cardSubData.name}
            </Link>
          ) : (
            <span className='mt-2 w-3/4 text-xl text-light-gray'>
              {cardSubData?.name}
            </span>
          )}
        </div>
      ) : (
        <>
          {big ? (
            <CardMain cardMainData={cardMainData} cardData={cardData} big />
          ) : (
            <div className='my-2 w-60 items-center justify-center 2xl:w-72'>
              <CardMain cardMainData={cardMainData} cardData={cardData} />
            </div>
          )}
        </>
      )}
    </>
  )
}

export default SpotifyCard
