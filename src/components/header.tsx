import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

const Header: React.FC = () => {
	return (
		<div className="ml-6 block w-16 pt-4">
			<Link href={`/search-musics/`}>
				<FontAwesomeIcon
					icon={faSpotify}
					className="rounded-full text-white"
					size="3x"
				/>
			</Link>
		</div>
	);
};

export default Header;
