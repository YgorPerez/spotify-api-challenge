import Image from "next/image";
import Link from "next/link";
import albumPlaceholderImage from "public/images/gray-square-placeholder.jpg";
import React from "react";
import { type Album as albumType } from "spotify-api.js";

const AlbumCard: React.FC<{ album: albumType }> = ({ album }) => {
	return (
		<div className="my-2 w-64 max-w-xs items-center justify-center text-center">
			<Link className="" href={`/album/${album.id}`}>
				<Image
					src={album.images?.[0]?.url || albumPlaceholderImage}
					alt="album cover"
					height={album.images?.[0]?.height as number}
					width={album.images?.[0]?.width as number}
				/>
				<p className=" text-white">{album.name}</p>
			</Link>
			<p className=" text-gray-300">{album.artists?.[0]?.name}</p>
		</div>
	);
};

export default AlbumCard;
