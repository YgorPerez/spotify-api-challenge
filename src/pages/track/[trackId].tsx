import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { type InferGetServerSidePropsType, type NextPage } from 'next'
import Error from 'next/error'
import { useRouter } from 'next/router'
import SpotifyCard from '../../components/app/SpotifyCard'
import Track from '../../components/app/Track'
import GoBack from '../../components/app/GoBack'
import Header from '../../components/ui/Header'
import { api } from '../../utils/api'
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

  if (!trackId || trackId.length < 1) {
    return <Error statusCode={404} />
  }

  const {
    data: getTrackData,
    isFetching,
    isError,
  } = api.spotify.getTrack.useQuery(
    { trackId },
    {
      staleTime: Infinity,
    },
  )

  if ((!getTrackData || !getTrackData.track || isError) && !isFetching) {
    return <Error statusCode={404} />
  }

  const track = getTrackData?.track ?? null

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
        <div className='ml-16'>
          <ol className='mx-2 list-decimal text-light-gray'>
            <Track track={track} />
          </ol>
        </div>
      </main>
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
  await trpc.spotify.getTrack.prefetch({ trackId })

  return {
    props: {
      trpcState: trpc.dehydrate(),
      trackId,
    },
  }
}

export default SingleTrackPage
