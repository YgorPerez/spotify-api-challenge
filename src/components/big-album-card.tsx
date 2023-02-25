import Image from "next/image";
import Link from "next/link";
import albumPlaceholderImage from "public/images/gray-square-placeholder.jpg";
import React from "react";
import { Album as albumType } from "spotify-api.js";

const BigAlbumCard: React.FC<{ album: albumType }> = ({ album }) => {
	return (
		<div className="max-h-lg my-2 max-w-lg items-center justify-center text-center">
			<div className="flex justify-center">
				<Image
					src={album.images?.[0]?.url || albumPlaceholderImage}
					alt="album cover"
					height={264}
					width={264}
				/>
			</div>
			<div className="">
				<h1 className="text-2xl text-white">{album.name}</h1>
				<Link href={`/albums/${album.artists?.[0]?.id}`}>
					<h2 className="text-1xl  text-gray-300">
						{album.artists?.[0]?.name}
					</h2>
				</Link>
			</div>
		</div>
	);
};

export default BigAlbumCard;
