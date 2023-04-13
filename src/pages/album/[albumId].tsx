import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { type InferGetServerSidePropsType, type NextPage } from 'next'
import Error from 'next/error'
import GoBack from '../../components/GoBack'
import Header from '../../components/Header'
import SpotifyCard from '../../components/SpotifyCard'
import Track from '../../components/Track'
import useGetAlbumTracks from '../../hooks/useGetAlbumTracks'
import { api } from '../../utils/api'
import { generateSSGHelper } from '../../utils/ssgHelper'
import { stringOrNull } from '../../utils/stringOrNull'

interface Props {
  albumId: string
}

const SingleAlbumPage: NextPage<Props> = ({
  albumId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: getAlbumData } = api.spotify.getAlbum.useQuery(
    {
      albumId,
    },
    { staleTime: Infinity },
  )

  const { data: getAlbumTracksData } = useGetAlbumTracks({
    albumId,
    limit: 15
  })

  if (
    !getAlbumData ||
    !getAlbumData.album ||
    !getAlbumTracksData?.pages
  ) {
    return <Error statusCode={404} />
  }

  const { album } = getAlbumData
  const tracks = getAlbumTracksData?.pages.flatMap((page) => page.tracks)

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
        <div className='ml-16 mb-4'>
          <ol className='mx-2 list-decimal text-light-gray'>
            {tracks.map((track, index) => (
              <Track key={index} track={track} />
            ))}
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
  const albumId = stringOrNull(context.query.albumId)

  if (!albumId || albumId.length < 1) {
    return {
      notFound: true,
    }
  }

  const ssg = generateSSGHelper(context)
  await ssg.spotify.getAlbum.prefetch({ albumId })
  await ssg.spotify.getAlbumTracks.prefetchInfinite({ albumId, limit: 15 })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      albumId,
    },
  }
}

export default SingleAlbumPage
