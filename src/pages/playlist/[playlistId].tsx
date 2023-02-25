import { NextPage } from "next";
import Error from "next/error";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "../../utils/api";

const SinglePlaylistPage: NextPage = () => {
	const router = useRouter();

	const playlistId = router.query.playlistId as string;

	const { data, isLoading } = api.spotify.getPlaylist.useQuery({
		playlistId: playlistId,
	});

	if (isLoading) {
		return <p>Carregando playlists...</p>;
	}

	if (!data) {
		return <Error statusCode={404} />;
	}

	return (
		<div>
			<h1>{data?.name}</h1>
			<p>{data?.owner.displayName}</p>
			<div>
				<ol>
					{data?.tracks?.map(({ track }) => {
						return (
							<li>
								<h2>{track?.name}</h2>
								<span>{track?.type}</span>
								<Link
									href={`/track/${track?.id}`}
								>{`/tracks/${track?.id}`}</Link>
							</li>
						);
					})}
				</ol>
			</div>
		</div>
	);
};

export default SinglePlaylistPage;
