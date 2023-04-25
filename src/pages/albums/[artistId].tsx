import LoadMore from '@components/app/LoadMore'
import ScrollArea from '@components/ui/ScrollArea'
import Separator from '@components/ui/Separator'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { type InferGetServerSidePropsType, type NextPage } from 'next'
import Error from 'next/error'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import Album from '../../components/app/Album'
import GoBack from '../../components/app/GoBack'
import SpotifyCard from '../../components/app/SpotifyCard'
import Header from '../../components/ui/Header'
import useGetArtistsAlbums from '../../hooks/useGetArtistAlbums'
import { api } from '../../utils/api'
import { ssrHelper } from '../../utils/ssrHelper'
import { stringOrNull } from '../../utils/stringOrNull'

interface Props {
  artistId: string
}

const albumsLimit = 15

function generateLoadingData(amount: number) {
  const loadingData = []
  for (let i = 1; i <= amount; i++) {
    loadingData.push(<Album key={i} album={null} />)
  }
  return loadingData
}

const loadingData = generateLoadingData(albumsLimit)

const SingleArtistPage: NextPage<Props> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const router = useRouter()

  const artistId = stringOrNull(
    props.artistId ? props.artistId : router.query.artistId,
  )

  const {
    data: getAritstData,
    isFetching: isFetchingArtist,
    isError: isErrorArtist,
  } = api.spotify.getArtist.useQuery(
    {
      artistId: artistId as string,
    },
    {
      staleTime: Infinity,
      enabled: Boolean(artistId),
    },
  )

  const {
    data: getArtistAlbumsData,
    isFetching: isFetchingAlbums,
    isError: isErrorAlbums,
    hasNextPage,
    fetchNextPage,
  } = useGetArtistsAlbums({
    artistId: artistId as string,
    enabled: Boolean(artistId),
    limit: albumsLimit,
  })

  const albums = useMemo(
    () => getArtistAlbumsData?.pages.flatMap(page => page.albums),
    [getArtistAlbumsData?.pages],
  )

  if (
    (!getAritstData ||
      !getAritstData.artist ||
      !getArtistAlbumsData?.pages ||
      isErrorAlbums ||
      isErrorArtist) &&
    !isFetchingAlbums &&
    !isFetchingArtist
  ) {
    return <Error statusCode={404} />
  }

  const artist = getAritstData?.artist ?? null

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
          <SpotifyCard cardData={artist} big />
        </div>
        <div className='ml-16'>
          <ScrollArea>
            <ol className='mx-2 list-decimal text-light-gray'>
              {albums?.map((album, index) => (
                <div
                  key={index}
                  onMouseEnter={() => {
                    void utils.spotify.getAlbum.prefetch({
                      albumId: album.id,
                    })
                    void utils.spotify.getAlbumTracks.prefetchInfinite({
                      albumId: album.id,
                      limit: 15,
                    })
                  }}
                >
                  <Album album={album} />
                </div>
              ))}
              {isFetchingAlbums && loadingData}
            </ol>
            {hasNextPage ? (
              <>
                <Separator className='my-2' />
                <LoadMore
                  loadMore={() => fetchNextPage}
                  isLoading={isFetchingAlbums}
                />
              </>
            ) : (
              'Nothing more to load'
            )}
          </ScrollArea>
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

  const trpc = ssrHelper(context)
  await trpc.spotify.getArtist.prefetch({ artistId })
  await trpc.spotify.getArtistAlbums.prefetchInfinite({
    artistId,
    limit: albumsLimit,
  })

  return {
    props: {
      trpcState: trpc.dehydrate(),
      artistId: artistId,
    },
  }
}

export default SingleArtistPage
