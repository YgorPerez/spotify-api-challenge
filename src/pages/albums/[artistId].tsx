import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { type InferGetServerSidePropsType, type NextPage } from 'next'
import Error from 'next/error'
import Album from '../../components/Album'
import GoBack from '../../components/GoBack'
import Header from '../../components/Header'
import SpotifyCard from '../../components/SpotifyCard'
import { api } from '../../utils/api'
import { generateSSGHelper } from '../../utils/ssgHelper'
import { stringOrNull } from '../../utils/stringOrNull'

interface IProps {
  artistId: string
}

const SingleArtistPage: NextPage<IProps> = ({
  artistId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: getAritstsAlbumsData } = api.spotify.getArtistAlbums.useQuery(
    {
      artistId,
    },
    {
      staleTime: Infinity,
    },
  )

  if (!getAritstsAlbumsData || !getAritstsAlbumsData.artist) {
    return <Error statusCode={404} />
  }

  const { artist, albums } = getAritstsAlbumsData

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
          <SpotifyCard cardData={artist} big />
        </div>
        <div className='ml-16'>
          <ol className='mx-2 list-decimal text-light-gray'>
            {albums.map(album => (
              <Album key={album.id} album={album} />
            ))}
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
  const artistId = stringOrNull(context.query.artistId)

  if (!artistId || artistId.length < 1) {
    return {
      notFound: true,
    }
  }

  const ssg = generateSSGHelper(context)
  await ssg.spotify.getArtistAlbums.prefetch({ artistId })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      artistId: artistId,
    },
  }
}

export default SingleArtistPage
