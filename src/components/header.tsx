import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

const Header: React.FC = () => {
  return (
    <header>
      <div className="ml-6 block w-16 pt-4">
        <Link href={`/search/`}>
          <FontAwesomeIcon
            icon={faSpotify}
            className="rounded-full text-white"
            size="3x"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
