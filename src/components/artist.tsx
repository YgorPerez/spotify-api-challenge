import Link from "next/link";
import React from "react";
import { Artist as ArtistType } from "spotify-api.js";

const Artist: React.FC<{ artist: ArtistType }> = ({ artist }) => {
	return (
		<li>
			<h2>{artist.name}</h2>
			<span>{artist.genres}</span>
			<Link href={`/albums/${artist.id}`}>{`/albums/${artist.id}`}</Link>
		</li>
	);
};

export default Artist;
