import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';

const Custom404 = () => {
  const { t } = useTranslation();

  return (
    <div className='min-h-[100vh] bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8'>
      <div className='mx-auto max-w-max'>
        <main className='sm:flex'>
          <p className='bg-gradient-to-br from-pink-400 to-cyan-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl'>
            Offline
          </p>
          <div className='sm:ml-6'>
            <div className='sm:border-l sm:border-gray-200 sm:pl-6'>
              <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
                {t('common:offline-extended')}
              </h1>
              <p className='mt-1 text-base text-gray-500'>
                {t('common:try-checking-connection')}
              </p>
            </div>
            <div className='mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6'>
              <Link
                href='/'
                className='inline-flex items-center rounded-md  border-transparent  bg-gradient-to-br from-pink-400 to-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gradient-to-br hover:from-pink-600 hover:to-cyan-800 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2'
              >
                {t('common:go-home')}
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Custom404;
