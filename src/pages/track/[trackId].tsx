import Player from '@components/app/Player'
import ScrollArea from '@components/ui/ScrollArea'
import useGetLyrics from '@hooks/useGetLyrics'
import useGetTrack from '@hooks/useGetTrack'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { type InferGetServerSidePropsType, type NextPage } from 'next'
import Error from 'next/error'
import { useRouter } from 'next/router'
import { type SimplifiedTrack } from 'spotify-web-api-ts-edge/types/types/SpotifyObjects'
import GoBack from '../../components/app/GoBack'
import SpotifyCard from '../../components/app/SpotifyCard'
import Header from '../../components/ui/Header'
import { ssrHelper } from '../../utils/ssrHelper'
import { stringOrNull } from '../../utils/stringOrNull'

interface Props {
  trackId: string
}

const SingleTrackPage: NextPage<Props> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const router = useRouter()

  const trackId = stringOrNull(
    props.trackId ? props.trackId : router.query.trackId,
  )

  const {
    data: trackData,
    isFetching: isFetchingTrack,
    isError: isErrorTrack,
  } = useGetTrack(trackId as string)

  const {
    data: lyrics,
    isFetching: isFetchingLyrics,
    isError: isErrorLyrics,
  } = useGetLyrics({
    artistName: trackData?.track.artists?.[0]?.name as string,
    songTitle: trackData?.track?.name as string,
  })

  if (!trackId || trackId.length < 1) {
    return <Error statusCode={404} />
  }

  if ((!trackData || !trackData.track || isErrorTrack) && !isFetchingTrack) {
    return <Error statusCode={404} />
  }

  const track = trackData?.track ?? null

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
          <SpotifyCard cardData={track} big />
        </div>
        {lyrics ? (
          <ScrollArea className='max-h-[70vh] translate-x-1/4 p-4 text-xl'>
            <p className='whitespace-pre text-white'>{lyrics}</p>
          </ScrollArea>
        ) : (
          <p>No lyrics found</p>
        )}
      </main>
      <Player songList={[track as SimplifiedTrack]} />
    </div>
  )
}

export const runtime = 'experimental-edge'

export const getServerSideProps: GetServerSideProps<Props> = async (
  context: GetServerSidePropsContext,
) => {
  const trackId = stringOrNull(context.query.trackId)

  if (!trackId || trackId.length < 1) {
    return {
      notFound: true,
    }
  }

  const trpc = ssrHelper(context)
  const track = await trpc.spotify.getTrack.fetch({ trackId })
  await trpc.spotify.getSongLyrics.prefetch({
    artistName: track.track.artists[0]?.name as string,
    songTitle: track.track.name,
  })

  return {
    props: {
      trpcState: trpc.dehydrate(),
      trackId,
    },
  }
}

export default SingleTrackPage
