import useGetLyrics from '@hooks/useGetLyrics';
import useGetTrack from '@hooks/useGetTrack';
import { ssrHelper } from '@utils/ssrHelper';
import { stringOrNull } from '@utils/stringOrNull';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { type InferGetServerSidePropsType, type NextPage } from 'next';
import { NextSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const Error = dynamic(() => import('next/error'));
const Header = dynamic(() => import('@components/ui/Header'), {
  loading: () => <p>Loading...</p>,
});
const Player = dynamic(() => import('@components/app/Player'));
const SpotifyCard = dynamic(() => import('@components/app/SpotifyCard'), {
  loading: () => <p>Loading...</p>,
});
const Lyrics = dynamic(() => import('@components/app/Lyrics'), {
  loading: () => <p>Loading...</p>,
});

interface Props {
  trackId: string;
}

const SingleTrackPage: NextPage<Props> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const router = useRouter();
  const { t, lang } = useTranslation();

  const trackId = stringOrNull(
    props.trackId ? props.trackId : router.query.trackId,
  );

  const {
    data: trackData,
    isFetching: isFetchingTrack,
    isError: isErrorTrack,
  } = useGetTrack(trackId as string);

  const {
    data: lyrics,
    isFetching: isFetchingLyrics,
    isError: isErrorLyrics,
  } = useGetLyrics({
    artistName: trackData?.track.artists?.[0]?.name as string,
    songTitle: trackData?.track?.name as string,
  });

  if (!trackId || trackId.length < 1) {
    return <Error statusCode={404} />;
  }

  if ((!trackData || !trackData.track || isErrorTrack) && !isFetchingTrack) {
    return <Error statusCode={404} />;
  }

  const track = trackData?.track ?? null;

  return (
    <>
      <NextSeo
        title={`${t('common:listen-to')} ${track?.name ?? ''}`}
        description={`${t('common:you-can-listen')} ${
          track?.artists?.[0]?.name ?? ''
        } ${track?.name ?? ''} ${t('common:album')}`}
        openGraph={{
          locale: lang,
          title: `${t('common:listen-to')} ${track?.name ?? ''}`,
          description: `${t('common:you-can-listen')} ${
            track?.artists?.[0]?.name ?? ''
          } ${track?.name ?? ''} ${t('common:song')}`,
          url: track?.href,
          audio: track?.preview_url
            ? [{ url: track.preview_url, type: 'audio/mpeg' }]
            : undefined,
          images: track?.album?.images,
        }}
      />
      <div>
        <div className='flex'>
          <Header goBack />
        </div>
        <main className='mt-6 lg:flex lg:justify-center 2xl:mt-8'>
          <div className='lg:-ml-18 mb-4 lg:mb-0 2xl:-ml-40'>
            <SpotifyCard cardData={track} big />
          </div>
          <Lyrics
            lyrics={lyrics}
            isFetching={isFetchingLyrics}
            isError={isErrorLyrics}
          />
          {track && <Player tracks={[track]} />}
        </main>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context: GetServerSidePropsContext,
) => {
  const trackId = stringOrNull(context.query.trackId);

  if (!trackId || trackId.length < 1) {
    return {
      notFound: true,
    };
  }

  const trpc = ssrHelper(context);
  const track = await trpc.spotify.getTrack.fetch({ trackId });

  await trpc.lyrics.getSongLyrics.prefetch({
    artistName: track.track.artists?.[0]?.name as string,
    songTitle: track.track.name,
  });

  await trpc.lyrics.getUser.prefetch();
  await trpc.lyrics.getAccessToken.prefetch();

  return {
    props: {
      trpcState: trpc.dehydrate(),
      trackId,
    },
  };
};

export default SingleTrackPage;
