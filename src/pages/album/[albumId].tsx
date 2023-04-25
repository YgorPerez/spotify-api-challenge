import ScrollArea from '@/components/ui/ScrollArea'
import LoadMore from '@components/app/LoadMore'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { type InferGetServerSidePropsType, type NextPage } from 'next'
import Error from 'next/error'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { type SimplifiedTrack } from 'spotify-web-api-ts-edge/types/types/SpotifyObjects'
import GoBack from '../../components/app/GoBack'
import SpotifyCard from '../../components/app/SpotifyCard'
import Track from '../../components/app/Track'
import Header from '../../components/ui/Header'
import useGetAlbumTracks from '../../hooks/useGetAlbumTracks'
import { api } from '../../utils/api'
import { ssrHelper } from '../../utils/ssrHelper'
import { stringOrNull } from '../../utils/stringOrNull'

interface Props {
  albumId: string
}

const tracksLimit = 15

function generateLoadingData(amount: number) {
  const loadingData = []
  for (let i = 1; i <= amount; i++) {
    loadingData.push(<Track key={i} track={null} />)
  }
  return loadingData
}

const loadingData = generateLoadingData(tracksLimit)

const SingleAlbumPage: NextPage<Props> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const router = useRouter()

  const albumId = stringOrNull(
    props.albumId ? props.albumId : router.query.albumId,
  )

  const {
    data: getAlbumData,
    isFetching: isFetchingAlbum,
    isError: isErrorAlbum,
  } = api.spotify.getAlbum.useQuery(
    {
      albumId: albumId as string,
    },
    { staleTime: Infinity },
  )

  const {
    data: getAlbumTracksData,
    isFetching: isFetchingTracks,
    isError: isErrorTracks,
    hasNextPage,
    fetchNextPage,
  } = useGetAlbumTracks({
    albumId: albumId as string,
    limit: tracksLimit,
  })

  const tracks = useMemo(
    () => getAlbumTracksData?.pages.flatMap(page => page.tracks),
    [getAlbumTracksData?.pages],
  )

  if (
    (!getAlbumData ||
      !getAlbumData.album ||
      !getAlbumTracksData?.pages ||
      isErrorAlbum ||
      isErrorTracks) &&
    !isFetchingAlbum &&
    !isFetchingTracks
  ) {
    return <Error statusCode={404} />
  }

  const album = getAlbumData?.album ?? null
  const utils = api.useContext()

  return (
    <div className='min-h-screen min-w-max bg-dark-gray'>
      <header className='flex'>
        <Header />
        <div className='ml-6 mt-8'>
          <GoBack />
        </div>
      </header>
      <main className='mt-6 flex'>
        <div className='ml-36'>
          <SpotifyCard cardData={album} big />
        </div>
        <ScrollArea>
          <div className='mb-4 ml-16'>
            <ol className='mx-2 list-decimal text-light-gray'>
              {tracks?.map((track, index) => (
                <div
                  key={index}
                  onMouseEnter={() => {
                    void utils.spotify.getTrack.prefetch({
                      trackId: track.id,
                    })
                  }}
                >
                  <Track track={track as SimplifiedTrack} />
                </div>
              ))}
              {isFetchingTracks && loadingData}
            </ol>
            {hasNextPage ? (
              <LoadMore
                loadMore={() => fetchNextPage}
                isLoading={isFetchingTracks}
              />
            ) : (
              'Nothing more to load'
            )}
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}

export const runtime = 'experimental-edge'

export const getServerSideProps: GetServerSideProps<Props> = async (
  context: GetServerSidePropsContext,
) => {
  const albumId = stringOrNull(context.query.albumId)

  if (!albumId || albumId.length < 1) {
    return {
      notFound: true,
    }
  }

  const trpc = ssrHelper(context)
  await trpc.spotify.getAlbum.prefetch({ albumId })
  await trpc.spotify.getAlbumTracks.prefetchInfinite({
    albumId,
    limit: tracksLimit,
  })

  return {
    props: {
      trpcState: trpc.dehydrate(),
      albumId,
    },
  }
}

export default SingleAlbumPage
