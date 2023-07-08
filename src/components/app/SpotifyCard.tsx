import { Button } from '@components/ui/Button';
import Skeleton from '@components/ui/Skeleton';
import { api } from '@utils/api';
import formatFollowers from '@utils/formatFollowers';
import formatText from '@utils/formatText';
import { log } from 'next-axiom';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import Link from 'next/link';
import { type FC } from 'react';
import type {
  Album as AlbumType,
  Artist as ArtistType,
  SpotifyImage as ImageType,
  SimplifiedAlbum as SimplifiedAlbumType,
  Track as TrackType,
} from 'spotify-web-api-ts-edge/types/types/SpotifyObjects';
import { useMediaQuery } from 'usehooks-ts';
import artistFallBackImg from '/public/images/artist-placeholder.jpg';

type CardData = AlbumType | TrackType | SimplifiedAlbumType | ArtistType | null;

type CardMainData = {
  images: ImageType[] | null;
  slugUrl: string;
} | null;

let titleLength = 27;
let subtitleLength = 24;

const SpotifyCard: FC<{
  cardData: CardData;
  big?: boolean;
}> = ({ cardData, big }) => {
  const { t } = useTranslation();

  //iife
  const { cardMainData, cardSubData } = (() => {
    if (cardData) {
      // Handle album data
      if ('album_type' in cardData) {
        return {
          cardMainData: {
            images: cardData.images,
            slugUrl: 'album',
          },
          cardSubData: {
            name: formatText(
              cardData.artists?.[0]?.name as string,
              subtitleLength,
            ),
            id: cardData.artists?.[0]?.id as string,
            slugUrl: 'albums',
          },
        };
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
        };
      }
      // Handle artist data
      if ('followers' in cardData) {
        return {
          cardMainData: {
            images: cardData.images || null,
            slugUrl: 'albums',
          },
          cardSubData: {
            name: `${t('common:fans')}: ${formatFollowers(
              cardData.followers.total || 0,
            )}`,
          },
        };
      }
    }
    return { cardMainData: null, cardSubData: null };
  })();

  if ((cardMainData && !cardData) || (cardSubData && !cardData)) {
    const message = 'Sub or main has data while card data does not';
    console.error(message);
    log.error(message);
  }

  const utils = api.useContext();
  const prefetchArtist = (artistId: string) => {
    void utils.spotify.getArtist.prefetch({ artistId });
    void utils.spotify.getArtistAlbums.prefetchInfinite({
      artistId,
      limit: 15,
    });
  };

  const prefetchAlbum = (albumId: string) => {
    void utils.spotify.getAlbum.prefetchInfinite({
      albumId,
    });
    void utils.spotify.getAlbumTracks.prefetchInfinite({
      albumId,
    });
  };

  const prefetchTrack = (track: TrackType) => {
    void utils.spotify.getTrack.prefetch({
      trackId: track.id,
    });
    void utils.spotify.getSongLyrics.prefetch({
      artistName: track.artists[0]?.name as string,
      songTitle: track.name,
    });
  };

  if (big && cardMainData && cardSubData && cardData) {
    return (
      <div
        className='m-auto max-w-[300px] items-center justify-center text-center
          lg:m-0 lg:my-2 lg:max-w-xs 2xl:max-w-md'
      >
        <CardMain cardMainData={cardMainData} cardData={cardData} big />
        <div className='mt-4 flex flex-col items-center'>
          <h1 className=' mb-2 w-4/5 text-2xl text-white-gray lg:text-3xl'>
            {formatText(cardData.name, titleLength)}
          </h1>
          {cardSubData.slugUrl ? (
            <Button asChild variant='link'>
              <Link
                href={`/${cardSubData.slugUrl}/${cardSubData.id}`}
                onFocus={() => prefetchArtist(cardSubData.id)}
                onMouseEnter={() => prefetchArtist(cardSubData.id)}
                className='text-xl !text-light-gray lg:text-2xl'
              >
                {cardSubData.name}
              </Link>
            </Button>
          ) : (
            <span className='text-xl text-light-gray lg:text-2xl'>
              {cardSubData.name}
            </span>
          )}
        </div>
      </div>
    );
  }
  return (
    <>
      {cardData && cardMainData ? (
        <div
          className='items-center justify-center text-center sm:my-2 sm:w-60
            2xl:w-72'
        >
          <Link
            href={`/${cardMainData.slugUrl}/${cardData.id}`}
            onFocus={() => {
              cardMainData.slugUrl === 'album' && prefetchAlbum(cardData.id);
              cardMainData.slugUrl === 'albums' && prefetchArtist(cardData.id);
              cardMainData.slugUrl === 'track' &&
                prefetchTrack(cardData as TrackType);
            }}
            onMouseEnter={() => {
              cardMainData.slugUrl === 'album' && prefetchAlbum(cardData.id);
              cardMainData.slugUrl === 'albums' && prefetchArtist(cardData.id);
              cardMainData.slugUrl === 'track' &&
                prefetchTrack(cardData as TrackType);
            }}
            className='flex flex-col items-center'
          >
            <CardMain cardMainData={cardMainData} cardData={cardData} />
          </Link>

          {cardSubData?.slugUrl ? (
            <Button asChild variant='link'>
              <Link
                href={`/${cardSubData.slugUrl}/${cardSubData.id}`}
                onFocus={() => prefetchArtist(cardSubData.id)}
                onMouseEnter={() => prefetchArtist(cardSubData.id)}
                className='!px-0 text-xs !text-light-gray sm:mt-2 sm:w-3/4 sm:text-xl'
              >
                {cardSubData.name}
              </Link>
            </Button>
          ) : (
            <span className='text-xs text-light-gray sm:mt-2 sm:w-3/4 sm:text-xl'>
              {cardSubData?.name}
            </span>
          )}
        </div>
      ) : (
        <>
          {big ? (
            <CardMain cardMainData={cardMainData} cardData={cardData} big />
          ) : (
            <div className='my-2 items-center justify-center lg:w-60 2xl:w-72'>
              <CardMain cardMainData={cardMainData} cardData={cardData} />
            </div>
          )}
        </>
      )}
    </>
  );
};

const CardMain: FC<{
  cardMainData: CardMainData;
  cardData: CardData;
  big?: boolean;
}> = ({ cardMainData, cardData, big }) => {
  const { t } = useTranslation();
  const isPhone = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 1023px)');
  let imageSize;
  let imageIndex;
  if (big) {
    if (isTablet) {
      imageIndex = 1;
      imageSize = 300;
      titleLength = 34;
      subtitleLength = 34;
    } else {
      imageIndex = 0;
      imageSize = 640;
      titleLength = 50;
      subtitleLength = 50;
    }
  } else {
    if (isPhone) {
      imageIndex = 2;
      imageSize = 64;
      titleLength = 12;
      subtitleLength = 12;
    } else {
      imageIndex = 1;
      imageSize = 300;
    }
  }
  return big ? (
    <>
      {cardMainData ? (
        <div className='flex justify-center'>
          <Image
            src={cardMainData?.images?.[imageIndex]?.url || artistFallBackImg}
            alt={
              cardMainData?.images?.[imageIndex]?.url
                ? t('common:album-cover')
                : t('common:artist-picture')
            }
            loading='lazy'
            width={imageSize}
            height={imageSize}
            className='aspect-square h-full w-full 2xl:w-[440px]'
          />
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center'>
          <Skeleton
            className='h-full min-h-[64px] w-full min-w-[64px]
              rounded-none sm:min-h-[320px] sm:min-w-[320px]
              2xl:min-h-[448px] 2xl:min-w-[448px]'
          />
          <div className='mb-2 mt-7 flex flex-col items-center'>
            <Skeleton className='h-7 w-[64px] sm:w-[250px]' />
            <Skeleton className='mt-5 h-5 w-[64px] sm:w-[200px]' />
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
            src={cardMainData.images?.[imageIndex]?.url || artistFallBackImg}
            loading='lazy'
            alt={
              cardMainData?.images?.[imageIndex]?.url
                ? 'album cover'
                : 'artist picture'
            }
            height={imageSize}
            width={imageSize}
          />
          <p className='mt-2 text-xs text-white-gray sm:mb-1 sm:mt-4 sm:w-4/5 sm:text-2xl'>
            {formatText(cardData.name, titleLength)}
          </p>
        </>
      ) : (
        <>
          <Skeleton className='-mt-2 min-h-[64px] min-w-[64px] rounded-none sm:min-h-[240px] sm:min-w-[240px]' />
          <div className='mt-3 flex flex-col items-center sm:mb-1 sm:mt-7'>
            <Skeleton className='h-2 w-[64px] sm:h-4 sm:w-[200px]' />
            <Skeleton className='mt-3 h-2 w-[64px] sm:mt-4 sm:h-4 sm:w-[150px]' />
          </div>
        </>
      )}
    </>
  );
};

export default SpotifyCard;
