import useGetAlbum from '@hooks/useGetAlbum';
import useGetAlbumTracks from '@hooks/useGetAlbumTracks';
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
const SpotifyCard = dynamic(() => import('@components/app/SpotifyCard'), {
  loading: () => <p>Loading...</p>,
});
const Separator = dynamic(() => import('@components/ui/Separator'));
const Header = dynamic(() => import('@components/ui/Header'), {
  loading: () => <p>Loading...</p>,
});
const LoadMore = dynamic(() => import('@components/app/LoadMore'), {
  loading: () => <p>Loading...</p>,
});
const ScrollArea = dynamic(() => import('@components/ui/ScrollArea'), {
  loading: () => <p>Loading...</p>,
});
const Player = dynamic(() => import('@components/app/Player'));
const Track = dynamic(() => import('@components/app/Track'));

interface Props {
  albumId: string;
}

const tracksLimit = 15;

function generateLoadingData(amount: number) {
  const loadingData = [];
  for (let i = 1; i <= amount; i++) {
    loadingData.push(<Track key={i} track={null} />);
  }
  return loadingData;
}

const loadingData = generateLoadingData(tracksLimit);

const SingleAlbumPage: NextPage<Props> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const router = useRouter();
  const { t, lang } = useTranslation();

  const albumId = stringOrNull(
    props.albumId ? props.albumId : router.query.albumId,
  );

  const {
    data: getAlbumData,
    isFetching: isFetchingAlbum,
    isError: isErrorAlbum,
  } = useGetAlbum(albumId as string);

  const {
    data: getAlbumTracksData,
    isFetching: isFetchingTracks,
    isError: isErrorTracks,
    hasNextPage,
    fetchNextPage,
  } = useGetAlbumTracks({
    albumId: albumId as string,
    limit: tracksLimit,
  });

  const tracks = useMemo(
    () => getAlbumTracksData?.pages.flatMap(page => page.tracks),
    [getAlbumTracksData?.pages],
  );

  if (
    (!getAlbumData ||
      !getAlbumData.album ||
      !getAlbumTracksData?.pages ||
      isErrorAlbum ||
      isErrorTracks) &&
    !isFetchingAlbum &&
    !isFetchingTracks
  ) {
    return <Error statusCode={404} />;
  }

  const album = getAlbumData?.album ?? null;

  return (
    <>
      <NextSeo
        title={`${t('common:listen-to')} ${album?.name ?? ''}`}
        description={`${t('common:you-can-listen')} ${
          album?.artists?.[0]?.name ?? ''
        } ${album?.name ?? ''} ${t('common:album')}`}
        openGraph={{
          locale: lang,
          title: `${t('common:listen-to')} ${album?.name ?? ''}`,
          description: `${t('common:you-can-listen')} ${
            album?.artists?.[0]?.name ?? ''
          } ${album?.name ?? ''} ${t('common:album')}`,
          url: album?.href,
          audio: tracks?.[0]?.preview_url
            ? tracks?.map(track => {
                return {
                  url: track?.preview_url as string,
                  type: 'audio/mpeg',
                };
              })
            : undefined,
          images: album?.images,
        }}
      />
      <div>
        <div className='flex'>
          <Header goBack />
        </div>
        <main className='mt-6 lg:flex lg:justify-center 2xl:mt-4'>
          <div className='mb-4 lg:mb-0 lg:ml-6 2xl:ml-0'>
            <SpotifyCard cardData={album} big />
          </div>
          <div className='mb-36 flex flex-col lg:mb-0 lg:ml-4 xl:ml-8 2xl:ml-16'>
            <ScrollArea className='lg:max-h-[calc(75vh_-_10rem)] 2xl:max-h-[calc(75vh_-_6rem)]'>
              <ol className='mx-2 list-decimal lg:mb-4'>
                {tracks?.map((track, index) => (
                  <Track track={track} key={index} />
                ))}
                {isFetchingTracks && loadingData}
              </ol>
            </ScrollArea>
            <Separator className='my-2' />
            <div className='mt-4 flex justify-center lg:block'>
              <LoadMore
                fetchNextPage={() => void fetchNextPage()}
                isLoading={isFetchingTracks}
                hasNextPage={hasNextPage}
              />
            </div>
          </div>
          {tracks && <Player tracks={tracks} />}
        </main>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context: GetServerSidePropsContext,
) => {
  const albumId = stringOrNull(context.query.albumId);

  if (!albumId || albumId.length < 1) {
    return {
      notFound: true,
    };
  }

  const trpc = ssrHelper(context);
  await trpc.spotify.getAlbum.prefetch({ albumId });
  await trpc.spotify.getAlbumTracks.prefetchInfinite({
    albumId,
    limit: tracksLimit,
  });
  await trpc.spotify.getUser.prefetch();
  await trpc.spotify.getAccessToken.prefetch();

  return {
    props: {
      trpcState: trpc.dehydrate(),
      albumId,
    },
  };
};

export default SingleAlbumPage;
