import type { NextPage, NextPageContext } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';

interface IProps {
  statusCode?: number;
}

const Error: NextPage<IProps> = ({ statusCode }) => {
  const { t } = useTranslation('common');

  return (
    <div className='min-h-full bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8'>
      <div className='mx-auto max-w-max'>
        <main className='sm:flex'>
          <p className='bg-gradient-to-br from-pink-400 to-cyan-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl'>
            {statusCode}
          </p>
          <div className='sm:ml-6'>
            <div className='sm:border-l sm:border-gray-200 sm:pl-6'>
              <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
                {t('generic-error')}
              </h1>
              <p className='mt-1 text-base text-gray-500'>
                {t('home-try-again')}
              </p>
            </div>
            <div className='mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6'>
              <Link
                href='/'
                className='inline-flex items-center rounded-md  border-transparent  bg-gradient-to-br from-pink-400 to-cyan-600 px-4 py-2 text-sm font-medium shadow-sm hover:bg-gradient-to-br hover:from-pink-600 hover:to-cyan-800 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2'
              >
                {t('go-home')}
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
