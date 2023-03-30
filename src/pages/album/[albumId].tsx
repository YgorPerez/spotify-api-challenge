import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { type InferGetServerSidePropsType, type NextPage } from 'next'
import Error from 'next/error'
import GoBack from '../../components/GoBack'
import Header from '../../components/Header'
import ImageCard from '../../components/ImageCard'
import Track from '../../components/Track'
import { api } from '../../utils/api'
import { generateSSGHelper } from '../../utils/ssgHelper'
import { stringOrNull } from '../../utils/stringOrNull'

const SingleAlbumPage: NextPage = ({
  albumId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data, isLoading } = api.spotify.getAlbumTracks.useQuery({
    albumId: albumId as string,
  })

  if (isLoading) {
    return <p>Carregando album...</p>
  }

  if (!data || !data.album) {
    return <Error statusCode={404} />
  }

  const { album, tracks } = data

  return (
    <div className='min-h-screen min-w-max bg-dark-gray'>
      <header className='flex'>
        <Header />
        <div className='mt-8 ml-6'>
          <GoBack />
        </div>
      </header>
      <main className='mt-6 flex'>
        <div className='ml-36'>
          <ImageCard cardData={album} big />
        </div>
        <div className='ml-16'>
          <ol className='mx-2 list-decimal text-light-gray'>
            {tracks.map(track => (
              <Track key={track.id} track={track} />
            ))}
          </ol>
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const albumId = stringOrNull(context.query.albumId)
  const ssg = await generateSSGHelper(context)

  await ssg.spotify.getAlbumTracks.prefetch({
    albumId: albumId as string,
  })
  if (typeof albumId === 'string' && albumId.length >= 1) {
    await ssg.spotify.getAlbumTracks.prefetch({
      albumId: albumId,
    })
  } else {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      // trpcState: ssg.dehydrate(),
      albumId: albumId,
    },
  }
}

export default SingleAlbumPage
