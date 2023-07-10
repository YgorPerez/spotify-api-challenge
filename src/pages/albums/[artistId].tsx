import Album from '@components/app/Album';
import ScrollArea from '@components/ui/ScrollArea';
import useGetArtist from '@hooks/useGetArtist';
import useGetArtistsAlbums from '@hooks/useGetArtistAlbums';
import { ssrHelper } from '@utils/ssrHelper';
import { stringOrNull } from '@utils/stringOrNull';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { type InferGetServerSidePropsType, type NextPage } from 'next';
import { NextSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

const Error = dynamic(() => import('next/error'));
const Header = dynamic(() => import('@components/ui/Header'), {
  loading: () => <p>Loading...</p>,
});
const LoadMore = dynamic(() => import('@components/app/LoadMore'), {
  loading: () => <p>Loading...</p>,
});
const SpotifyCard = dynamic(() => import('@components/app/SpotifyCard'), {
  loading: () => <p>Loading...</p>,
});
const Separator = dynamic(() => import('@components/ui/Separator'));

interface Props {
  artistId: string;
}

const albumsLimit = 15;

function generateLoadingData(amount: number) {
  const loadingData = [];
  for (let i = 1; i <= amount; i++) {
    loadingData.push(<Album key={i} album={null} />);
  }
  return loadingData;
}

const loadingData = generateLoadingData(albumsLimit);

const SingleArtistPage: NextPage<Props> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const router = useRouter();
  const { t } = useTranslation();

  const artistId = stringOrNull(
    props.artistId ? props.artistId : router.query.artistId,
  );

  const {
    data: getAritstData,
    isFetching: isFetchingArtist,
    isError: isErrorArtist,
  } = useGetArtist(artistId as string);

  const {
    data: getArtistAlbumsData,
    isFetching: isFetchingAlbums,
    isError: isErrorAlbums,
    hasNextPage,
    fetchNextPage,
  } = useGetArtistsAlbums({
    artistId: artistId as string,
    enabled: Boolean(artistId),
    limit: albumsLimit,
  });

  const albums = useMemo(
    () => getArtistAlbumsData?.pages.flatMap(page => page.albums),
    [getArtistAlbumsData?.pages],
  );

  if (
    (!getAritstData ||
      !getAritstData.artist ||
      !getArtistAlbumsData?.pages ||
      isErrorAlbums ||
      isErrorArtist) &&
    !isFetchingAlbums &&
    !isFetchingArtist
  ) {
    return <Error statusCode={404} />;
  }

  const artist = getAritstData?.artist ?? null;

  return (
    <>
      <NextSeo
        title={`${t('common:artist')}: ${artist?.name ?? ''}`}
        description={`${t('common:see-more')} ${artist?.name ?? ''}`}
        openGraph={{
          type: 'website',
          url: artist?.external_urls[0],
          title: `${t('common:artist')}: ${artist?.name ?? ''}`,
          description: `${t('common:see-more')} ${artist?.name ?? ''}`,
          images: [
            {
              url: artist?.images[0]?.url ?? '',
              alt: `${t('common:artist-picture')} ${artist?.name ?? ''}`,
              width: artist?.images[0]?.width,
              height: artist?.images[0]?.height,
            },
          ],
        }}
      />

      <div>
        <div className='flex'>
          <Header goBack />
        </div>
        <main className='mt-6 lg:flex lg:justify-center 2xl:mt-8'>
          <div className='mb-4 lg:mb-0 lg:ml-6 2xl:ml-0'>
            <SpotifyCard cardData={artist} big />
          </div>
          <div className='flex flex-col lg:ml-4 xl:ml-8 2xl:ml-16'>
            <ScrollArea className='lg:max-h-[75vh]'>
              <ol className='mx-2 flex w-[95vw] list-decimal flex-col justify-center lg:w-[55vw]'>
                {albums?.map((album, index) => (
                  <Album album={album} key={index} />
                ))}
                {isFetchingAlbums && loadingData}
              </ol>
            </ScrollArea>
            <Separator className='my-2' />
            <div className='mb-4 mt-4 flex justify-center lg:block'>
              <LoadMore
                fetchNextPage={() => void fetchNextPage()}
                isLoading={isFetchingAlbums}
                hasNextPage={hasNextPage}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context: GetServerSidePropsContext,
) => {
  const artistId = stringOrNull(context.query.artistId);

  if (!artistId || artistId.length < 1) {
    return {
      notFound: true,
    };
  }

  const trpc = ssrHelper(context);
  await trpc.spotify.getArtist.prefetch({ artistId });
  await trpc.spotify.getArtistAlbums.prefetchInfinite({
    artistId,
    limit: albumsLimit,
  });

  return {
    props: {
      trpcState: trpc.dehydrate(),
      artistId: artistId,
    },
  };
};

export default SingleArtistPage;
