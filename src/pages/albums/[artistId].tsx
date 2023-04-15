import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { type InferGetServerSidePropsType, type NextPage } from 'next'
import Error from 'next/error'
import { useMemo } from 'react'
import Album from '../../components/Album'
import GoBack from '../../components/GoBack'
import Header from '../../components/Header'
import SpotifyCard from '../../components/SpotifyCard'
import useGetArtistsAlbums from '../../hooks/useGetArtistAlbums'
import { api } from '../../utils/api'
import { generateSSGHelper } from '../../utils/ssgHelper'
import { stringOrNull } from '../../utils/stringOrNull'

interface Props {
  artistId: string
}

const albumsLimit = 15

function generateFakeAlbumsData(amount: number) {
  const fakeAlbums = { albums: [null] }
  for (let i = 1; i < amount; i++) {
    fakeAlbums.albums.push(null)
  }
  return fakeAlbums
}

const SingleArtistPage: NextPage<Props> = ({
  artistId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: getAritstData } = api.spotify.getArtist.useQuery(
    {
      artistId,
    },
    {
      staleTime: Infinity,
    },
  )

  const { data: getArtistAlbumsData, isFetchingNextPage } = useGetArtistsAlbums({
    artistId,
    limit: albumsLimit
  })

  const placeholderAlbumsData = useMemo(() => generateFakeAlbumsData(albumsLimit), [])
  const albums = useMemo(() => getArtistAlbumsData?.pages.flatMap((page) => page.albums), [getArtistAlbumsData?.pages])

  if (!getAritstData || !getAritstData.artist || !getArtistAlbumsData?.pages) {
    return <Error statusCode={404} />
  }

  const { artist } = getAritstData

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
            {albums?.map((album, index) => (
              <Album key={index} album={album} />
            ))}
            {isFetchingNextPage && placeholderAlbumsData.albums.map((album, index) => (
              <Album key={index} album={album} />
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
  const artistId = stringOrNull(context.query.artistId)

  if (!artistId || artistId.length < 1) {
    return {
      notFound: true,
    }
  }

  const ssg = generateSSGHelper(context)
  await ssg.spotify.getArtist.prefetch({ artistId })
  await ssg.spotify.getArtistAlbums.prefetchInfinite({ artistId, limit: albumsLimit })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      artistId: artistId,
    },
  }
}

export default SingleArtistPage
