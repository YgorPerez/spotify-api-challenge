import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { type FC } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import spotifyLogo from '/public/images/spotify-app-logo.webp';

interface Props {
  goBack?: boolean;
}

const ThemeSwitcher = dynamic(() => import('@components/app/ThemeSwitcher'), {
  loading: () => <p>Loading...</p>,
});
const GoBack = dynamic(() => import('@components/app/GoBack'), {
  loading: () => <p>Loading...</p>,
});

const Header: FC<Props> = ({ goBack }: Props) => {
  const isSmallerLG = useMediaQuery('(max-width: 1023px)');

  return (
    <>
      {isSmallerLG ? (
        <header className='mx-4 flex w-[calc(100%_-_2rem)] max-w-[100vw] justify-between pt-4 sm:pt-4 lg:pt-6'>
          <div className='block h-9 w-9 sm:h-12 sm:w-12 lg:h-14 lg:w-14'>
            <Link href={`/?search=`}>
              <Image
                src={spotifyLogo}
                alt='Spotify logo'
                loading='eager'
                onClick={() => document.getElementById('search')?.click()}
              />
            </Link>
          </div>
          {goBack && (
            <div className='lg:mr-4 lg:mt-8 xl:ml-14'>
              <GoBack />
            </div>
          )}
          <div>
            <ThemeSwitcher />
          </div>
        </header>
      ) : goBack ? (
        <header className='mx-4 flex w-[calc(100%_-_2rem)] max-w-[100vw] justify-between pt-4 sm:pt-4 lg:pt-6'>
          <div className='flex'>
            <Link
              href={`/?search=`}
              className='h-9 w-9 sm:h-12 sm:w-12 lg:h-14 lg:w-14'
            >
              <Image src={spotifyLogo} alt='Spotify logo' loading='eager' />
            </Link>
            <div className='ml-14 mr-4 mt-8 2xl:ml-20'>
              <GoBack />
            </div>
          </div>
          <div>
            <ThemeSwitcher />
          </div>
        </header>
      ) : (
        <header className='mx-4 flex w-[calc(100%_-_2rem)] max-w-[100vw] justify-between pt-4 sm:pt-4 lg:pt-6'>
          <div className='block h-9 w-9 sm:h-12 sm:w-12 lg:h-14 lg:w-14'>
            <Link href={`/?search=`}>
              <Image src={spotifyLogo} alt='Spotify logo' loading='eager' />
            </Link>
          </div>
          <div>
            <ThemeSwitcher />
          </div>
        </header>
      )}
    </>
  );
};

export default Header;
