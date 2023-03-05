import Link from "next/link";
import React from "react";
import { type Track as TrackType } from "spotify-api.js";
import formatMilliseconds from "../utils/format-milliseconds";

const Track: React.FC<{ track: TrackType }> = ({ track }) => {
	const trackDurationInReadableTime = formatMilliseconds({
		milliseconds: track.duration,
	});
	return (
		<li>
			<Link
				href={`/track/${track.id}`}
				className="ml-4 flex w-screen justify-between text-center leading-8 xl:max-w-lg 2xl:max-w-4xl"
			>
				<h2 className="text-gray-50">{track.name}</h2>
				<span className="text-gray-400">
					{trackDurationInReadableTime}
				</span>
			</Link>
		</li>
	);
};

export default Track;
