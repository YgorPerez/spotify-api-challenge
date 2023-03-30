import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { type InferGetServerSidePropsType, type NextPage } from 'next'
import Error from 'next/error'
import Link from 'next/link'
import { api } from '../../utils/api'
import { generateSSGHelper } from '../../utils/ssgHelper'
import { stringOrNull } from '../../utils/stringOrNull'

interface IProps {
  artistId: string
}

const SingleArtistPage: NextPage<IProps> = ({
  artistId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: getAritstsAlbumsData } = api.spotify.getArtistAlbums.useQuery({
    artistId,
  })

  if (!getAritstsAlbumsData || !getAritstsAlbumsData.artist) {
    return <Error statusCode={404} />
  }

  const { artist, albums } = getAritstsAlbumsData

  return (
    <div>
      <h1>{artist.name}</h1>
      <p>{artist.totalFollowers}</p>
      <Link href={`/album/${albums?.[0]?.id as string}`}>{`/album/${
        albums?.[0]?.id as string
      }`}</Link>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<IProps> = async (
  context: GetServerSidePropsContext,
) => {
  const artistId = stringOrNull(context.query.artistId)

  if (!artistId || artistId.length < 1) {
    return {
      notFound: true,
    }
  }

  const ssg = await generateSSGHelper(context)
  await ssg.spotify.getArtistAlbums.prefetch({ artistId })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      artistId: artistId,
    },
  }
}

export default SingleArtistPage
