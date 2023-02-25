import { NextPage } from "next";
import Error from "next/error";
import { useRouter } from "next/router";
import BigAlbumCard from "../../components/big-album-card";
import GoToPreviousPage from "../../components/go-back";
import Header from "../../components/header";
import Track from "../../components/track";
import { api } from "../../utils/api";

const SingleAlbumPage: NextPage = () => {
	const router = useRouter();

	const albumId = router.query.albumId as string;

	const { data, isLoading } = api.spotify.getAlbumTracks.useQuery({
		albumId: albumId,
	});

	if (isLoading) {
		return <p>Carregando album...</p>;
	}

	if (!data || !data.album) {
		return <Error statusCode={404} />;
	}

	const { album, tracks } = data;

	return (
		<div className="min-h-screen bg-gray-900">
			<header className="flex">
				<Header />
				<div className="mt-8 ml-6">
					<GoToPreviousPage />
				</div>
			</header>
			<main className="mt-6 flex">
				<div className="ml-36">
					<BigAlbumCard album={album} />
				</div>
				<div className="ml-16">
					<ol className="mx-2 list-decimal text-gray-400">
						{tracks.map((track) => (
							<Track key={track.id} track={track} />
						))}
					</ol>
				</div>
			</main>
		</div>
	);
};

export default SingleAlbumPage;
