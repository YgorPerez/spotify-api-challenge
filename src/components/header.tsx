import Link from "next/link";
import React from "react";
import { FaSpotify } from "react-icons/fa";

const Header: React.FC = () => {
	return (
		<div className="ml-6 block w-16  xl:pt-1 2xl:pt-2">
			<Link href={`/search-musics/`}>
				<FaSpotify size={54} color="white" />
			</Link>
		</div>
	);
};

export default Header;
