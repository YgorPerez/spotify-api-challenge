import ScrollArea from '@/components/ui/ScrollArea';
import Separator from '@/components/ui/Separator';
import LoadMore from '@components/app/LoadMore';
import Player from '@components/app/Player';
import useGetAlbum from '@hooks/useGetAlbum';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { type InferGetServerSidePropsType, type NextPage } from 'next';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { type SimplifiedTrack } from 'spotify-web-api-ts-edge/types/types/SpotifyObjects';
import GoBack from '../../components/app/GoBack';
import SpotifyCard from '../../components/app/SpotifyCard';
import Track from '../../components/app/Track';
import Header from '../../components/ui/Header';
import useGetAlbumTracks from '../../hooks/useGetAlbumTracks';
import { ssrHelper } from '../../utils/ssrHelper';
import { stringOrNull } from '../../utils/stringOrNull';

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
    <div>
      <div className='flex'>
        <Header />
        <div className='mr-4 mt-4 flex w-full justify-end lg:mt-8 xl:ml-14 xl:block'>
          <GoBack />
        </div>
      </div>
      <main className='mt-6 lg:flex lg:justify-center 2xl:mt-4'>
        <div className='mb-4 lg:mb-0 lg:ml-6 2xl:ml-0'>
          <SpotifyCard cardData={album} big />
        </div>
        <ScrollArea className='mb-44 lg:mb-0 lg:ml-4 lg:max-h-[75vh] xl:ml-16'>
          <ol className='mx-2 list-decimal text-light-gray lg:mb-4'>
            {tracks?.map((track, index) => (
              <div
                key={index}
                className='flex justify-around lg:block 2xl:my-1'
              >
                <Track track={track as SimplifiedTrack} />
              </div>
            ))}
            {isFetchingTracks && loadingData}
          </ol>
          <Separator className='my-2' />
          <div className='mt-4 flex justify-center lg:block'>
            <LoadMore
              fetchNextPage={() => void fetchNextPage()}
              isLoading={isFetchingTracks}
              hasNextPage={hasNextPage}
            />
          </div>
        </ScrollArea>
      </main>
      {tracks && <Player songList={tracks as SimplifiedTrack[]} />}
    </div>
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

  return {
    props: {
      trpcState: trpc.dehydrate(),
      albumId,
    },
  };
};

export default SingleAlbumPage;
