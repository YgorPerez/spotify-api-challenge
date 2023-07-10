import Skeleton from '@components/ui/Skeleton';
import { api } from '@utils/api';
import formatFollowers from '@utils/formatFollowers';
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
            name: cardData.artists?.[0]?.name as string,
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
            name: cardData.artists?.[0]?.name as string,

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
          lg:m-0 lg:max-w-[440px]'
      >
        <CardMain cardMainData={cardMainData} cardData={cardData} big />
        <div className='mt-4 flex flex-col items-center'>
          <h1 className='mb-2 line-clamp-2 w-4/5  text-2xl lg:text-3xl'>
            {cardData.name}
          </h1>
          {cardSubData.slugUrl ? (
            <Link
              href={`/${cardSubData.slugUrl}/${cardSubData.id}`}
              onFocus={() => prefetchArtist(cardSubData.id)}
              onMouseEnter={() => prefetchArtist(cardSubData.id)}
              className='line-clamp-2 w-4/5 text-ellipsis text-xl text-primary-foreground underline-offset-4 hover:underline lg:text-2xl'
            >
              {cardSubData.name}
            </Link>
          ) : (
            <span className='line-clamp-2 w-4/5 text-xl text-primary-foreground lg:text-2xl'>
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
          className='w-full max-w-[64px] items-center justify-center text-center
            sm:w-60 sm:max-w-[300px] 2xl:w-72'
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
            className='group flex flex-col items-center'
          >
            <CardMain cardMainData={cardMainData} cardData={cardData} />
          </Link>

          {cardSubData?.slugUrl ? (
            <Link
              href={`/${cardSubData.slugUrl}/${cardSubData.id}`}
              onFocus={() => prefetchArtist(cardSubData.id)}
              onMouseEnter={() => prefetchArtist(cardSubData.id)}
              className='mt-2 line-clamp-2 w-full text-center text-xs text-primary-foreground underline-offset-4 hover:underline sm:text-xl'
            >
              {cardSubData.name}
            </Link>
          ) : (
            <span className='mt-2 line-clamp-2 w-full text-center text-xs text-primary-foreground sm:text-xl'>
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
  const isSmallerSM = useMediaQuery('(max-width: 639px)');
  const isSmallerLG = useMediaQuery('(max-width: 1023px)');
  let imageSize;
  let imageIndex;
  if (big) {
    if (isSmallerLG) {
      imageIndex = 1;
      imageSize = 300;
    } else {
      imageIndex = 0;
      imageSize = 640;
    }
  } else {
    if (isSmallerSM) {
      imageIndex = 2;
      imageSize = 64;
    } else {
      imageIndex = 1;
      imageSize = 300;
    }
  }
  return big ? (
    <>
      {cardMainData && cardData ? (
        <div className='flex justify-center'>
          <Image
            src={cardMainData?.images?.[imageIndex]?.url || artistFallBackImg}
            alt={
              cardMainData?.images?.[imageIndex]?.url
                ? `${cardData.name} ${t('common:album-cover')}`
                : `${t('common:picture-from')} ${cardData.name}`
            }
            loading='eager'
            width={imageSize}
            height={imageSize}
            className='aspect-square h-full w-full lg:w-[340px] xl:w-[380px] 2xl:w-[420px]'
          />
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center'>
          <Skeleton
            className='min-h-[300px] min-w-[300px] rounded-none lg:h-full lg:min-h-[320px] lg:w-full lg:min-w-[320px]
              2xl:min-h-[448px] 2xl:min-w-[448px]'
          />
          <div className='mb-2 mt-5 flex flex-col items-center lg:mt-7'>
            <Skeleton className='h-6 w-[250px] lg:h-7 lg:w-[250px]' />
            <Skeleton className='mt-5 h-5 w-[230px] lg:w-[200px]' />
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
            loading='eager'
            alt={
              cardMainData?.images?.[imageIndex]?.url
                ? `${cardData.name} ${t('common:album-cover')}`
                : `${t('common:picture-from')} ${cardData.name}`
            }
            height={imageSize}
            width={imageSize}
          />
          <p className='mt-2 line-clamp-2 w-full text-xs underline-offset-4 group-hover:underline sm:mt-4 sm:w-4/5 sm:text-2xl'>
            {cardData.name}
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
