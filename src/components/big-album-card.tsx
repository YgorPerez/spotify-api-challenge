import Image from "next/image";
import Link from "next/link";
import albumPlaceholderImage from "public/images/gray-square-placeholder.jpg";
import React from "react";
import { type Album as albumType } from "spotify-api.js";

const BigAlbumCard: React.FC<{ album: albumType }> = ({ album }) => {
	return (
		<div className="my-2 items-center justify-center text-center md:max-w-[10rem] lg:max-w-xs 2xl:max-w-md">
			<div className="flex justify-center">
				<Image
					src={album.images?.[0]?.url || albumPlaceholderImage}
					alt="album cover"
					width={album.images?.[0]?.width as number}
					height={album.images?.[0]?.height as number}
					className="h-full w-full"
				/>
			</div>
			<div className="pt-2">
				<h1 className=" text-3xl text-white-gray 2xl:text-4xl">
					{album.name}
				</h1>
				<Link href={`/albums/${album.artists?.[0]?.id as string}`}>
					<h2 className="pt-1 text-xl text-light-gray 2xl:text-2xl">
						{album.artists?.[0]?.name}
					</h2>
				</Link>
			</div>
		</div>
	);
};

export default BigAlbumCard;
