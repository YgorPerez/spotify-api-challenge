import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

const Header: React.FC = () => {
	return (
		<div className="ml-6 block w-16  xl:pt-1 2xl:pt-2">
			<Link href={`/search-musics/`}>
				<FontAwesomeIcon
					icon={faSpotify}
					color="white"
					className="text-lg"
					size="xl"
				/>
			</Link>
		</div>
	);
};

export default Header;
