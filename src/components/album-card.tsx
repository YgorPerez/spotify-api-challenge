import Image from "next/image";
import Link from "next/link";
import albumPlaceholderImage from "public/images/gray-square-placeholder.jpg";
import React from "react";
import { type Album as albumType } from "spotify-api.js";

const AlbumCard: React.FC<{ album: albumType }> = ({ album }) => {
	return (
		<div className="my-2 w-60 items-center justify-center text-center 2xl:w-72">
			<Link href={`/album/${album.id}`}>
				<Image
					src={album.images?.[0]?.url || albumPlaceholderImage}
					alt="album cover"
					height={album.images?.[0]?.height as number}
					width={album.images?.[0]?.width as number}
				/>
				<p className="pt-4 pb-1 text-2xl text-white-gray">
					{album.name}
				</p>
			</Link>
			<Link
				href={`/albums/${album.artists?.[0]?.id as string}`}
				className="pt-2 text-xl text-light-gray"
			>
				{album.artists?.[0]?.name}
			</Link>
		</div>
	);
};

export default AlbumCard;
