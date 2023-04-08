import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { type InferGetServerSidePropsType, type NextPage } from 'next'
import Error from 'next/error'
import GoBack from '../../components/GoBack'
import Header from '../../components/Header'
import SpotifyCard from '../../components/SpotifyCard'
import Track from '../../components/Track'
import { api } from '../../utils/api'
import { generateSSGHelper } from '../../utils/ssgHelper'
import { stringOrNull } from '../../utils/stringOrNull'

interface IProps {
  trackId: string
}

const SingleTrackPage: NextPage<IProps> = ({
  trackId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: getTrackData } = api.spotify.getTrack.useQuery(
    { trackId },
    {
      staleTime: Infinity,
    },
  )

  if (!getTrackData || !getTrackData.track) {
    return <Error statusCode={404} />
  }

  const { track } = getTrackData

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
            <Track key={track.id} track={track} />
          </ol>
        </div>
      </main>
    </div>
  )
}

export const runtime = 'experimental-edge'

export const getServerSideProps: GetServerSideProps<IProps> = async (
  context: GetServerSidePropsContext,
) => {
  const trackId = stringOrNull(context.query.trackId)

  if (!trackId || trackId.length < 1) {
    return {
      notFound: true,
    }
  }

  const ssg = generateSSGHelper(context)
  await ssg.spotify.getTrack.prefetch({ trackId })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      trackId,
    },
  }
}

export default SingleTrackPage
