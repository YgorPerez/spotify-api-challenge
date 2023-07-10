import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';

const Custom500 = () => {
  const { t } = useTranslation();
  return (
    <div className='min-h-[100vh] bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8'>
      <div className='mx-auto max-w-max'>
        <main className='sm:flex'>
          <p className='bg-gradient-to-br from-red-400 to-yellow-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl'>
            500
          </p>
          <div className='sm:ml-6'>
            <div className='sm:border-l sm:border-gray-200 sm:pl-6'>
              <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
                {t('common:server-error')}
              </h1>
              <p className='mt-1 text-base text-gray-500'>
                {t('common:server-error-extended')}
              </p>
            </div>
            <div className='mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6'>
              <Link
                className='inline-flex items-center rounded-md border-transparent bg-gradient-to-br from-red-400 to-yellow-600 px-4 py-2 text-sm font-medium  shadow-sm hover:bg-gradient-to-br hover:from-red-600 hover:to-yellow-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
                href='/'
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

export default Custom500;
