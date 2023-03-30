import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { type InferGetServerSidePropsType, type NextPage } from 'next'
import Error from 'next/error'
import Link from 'next/link'
import { api } from '../../utils/api'
import { generateSSGHelper } from '../../utils/ssgHelper'
import { stringOrNull } from '../../utils/stringOrNull'

interface IProps {
  trackId: string
}

const SingleTrackPage: NextPage<IProps> = ({
  trackId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: getTrackData } = api.spotify.getTrack.useQuery({ trackId })

  if (!getTrackData || !getTrackData.track) {
    return <Error statusCode={404} />
  }

  const { track } = getTrackData

  return (
    <div>
      <h1>{track.name}</h1>
      <p>{track.duration}</p>
      <Link href={`/album/${track.album?.id as string}`}>
        {`/album/${track.album?.id as string}`}
      </Link>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<IProps> = async (
  context: GetServerSidePropsContext,
) => {
  const trackId = stringOrNull(context.query.trackId)

  if (!trackId || trackId.length < 1) {
    return {
      notFound: true,
    }
  }

  const ssg = await generateSSGHelper(context)
  await ssg.spotify.getTrack.prefetch({ trackId })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      trackId,
    },
  }
}

export default SingleTrackPage
