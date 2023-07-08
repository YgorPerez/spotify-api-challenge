import Image from 'next/image';
import Link from 'next/link';
import { type FC } from 'react';
import spotifyLogo from '/public/images/spotify-app-logo.webp';

const Header: FC = () => {
  return (
    <header className='pt-4 sm:pt-4 lg:pt-6'>
      <div className='ml-4 block h-9 w-9 sm:h-12 sm:w-12 lg:ml-6 lg:h-14 lg:w-14'>
        <Link href={`/`}>
          <Image
            src={spotifyLogo}
            alt='Spotify logo'
            placeholder='blur'
            height={64}
            width={64}
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
