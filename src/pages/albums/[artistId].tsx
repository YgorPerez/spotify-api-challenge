import { NextPage } from "next";
import Error from "next/error";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "../../utils/api";

const SingleArtistPage: NextPage = () => {
	const router = useRouter();

	const artistId = router.query.artistId as string;

	const { data, isLoading } = api.spotify.getArtistAlbums.useQuery({
		artistId: artistId,
	});

	if (isLoading) {
		return <p>Carregando artista...</p>;
	}

	if (!data) {
		return <Error statusCode={404} />;
	}

	return (
		<div>
			<h1>{data?.artist?.name}</h1>
			<p>{data?.artist?.totalFollowers}</p>
			<Link
				href={`/album/${data?.albums?.[0]?.id}`}
			>{`/album/${data?.albums?.[0]?.id}`}</Link>
		</div>
	);
};

export default SingleArtistPage;
