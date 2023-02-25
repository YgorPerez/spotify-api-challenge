import { NextPage } from "next";
import Error from "next/error";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "../../utils/api";

const SingleTrackPage: NextPage = () => {
	const router = useRouter();

	const trackId = router.query.trackId as string;

	const { data, isLoading } = api.spotify.getTrack.useQuery({
		trackId: trackId,
	});

	if (isLoading) {
		return <p>Carregando track...</p>;
	}

	if (!data) {
		return <Error statusCode={404} />;
	}

	return (
		<div>
			<h1>{data?.name}</h1>
			<p>{data?.duration}</p>
			<Link href={`/album/${data?.album?.id}`}>
				{`/album/${data?.album?.id}`}
			</Link>
		</div>
	);
};

export default SingleTrackPage;
