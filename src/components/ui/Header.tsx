import GoBack from '@components/app/GoBack';
import ThemeSwitcher from '@components/app/ThemeSwitcher';
import Image from 'next/image';
import Link from 'next/link';
import { type FC } from 'react';
import spotifyLogo from '/public/images/spotify-app-logo.webp';

interface Props {
  goBack?: boolean;
}

const Header: FC<Props> = ({ goBack }: Props) => {
  return (
    <header className='flex w-[calc(100vw_-_4rem)] justify-between pt-4 sm:pt-4 lg:pt-6'>
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
      {goBack && (
        <div className='mr-4 mt-4 flex w-full justify-end lg:mt-8 xl:ml-14 xl:block'>
          <GoBack />
        </div>
      )}
      <div className=''>
        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Header;
