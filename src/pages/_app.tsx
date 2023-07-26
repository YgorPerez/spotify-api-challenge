import usePersistQueryClient from '@hooks/usePersistQueryClient';
import useSSRIntercept from '@hooks/useSSRIntercept';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { api } from '@utils/api';
import { Analytics } from '@vercel/analytics/react';
import { DefaultSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';
import { type AppType } from 'next/app';
import dynamic from 'next/dynamic';
import { Roboto } from 'next/font/google';
import config from '../../next-seo.config';
import '../styles/globals.scss';

const ErrorBoundary = dynamic(() => import('@components/hoc/ErrorBoundary'));

const ThemeProvider = dynamic(() =>
  import('next-themes').then(mod => mod.ThemeProvider),
);

const roboto = Roboto({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-roboto',
  fallback: ['Segoe UI'],
});

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  usePersistQueryClient();
  useSSRIntercept(); // makes gssp run only once
  const { t, lang } = useTranslation();
  return (
    <>
      <DefaultSeo
        {...config}
        defaultTitle={t('common:title')}
        description={t('common:description')}
        openGraph={{
          title: t('common:title'),
          description: t('common:description'),
          locale: lang,
          type: 'website',
          siteName: 'Music Api Challenge',
          images: [
            {
              url: 'https://i.imgur.com/9uuDwGJ.png',
              alt: 'home image preview, cropped to fit',
              width: 1200,
              height: 630,
            },
          ],
        }}
      />
      <div className={roboto.className}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
          <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
        </ThemeProvider>
      </div>
      <Analytics mode={'production'} />
    </>
  );
};

export { reportWebVitals } from 'next-axiom';
export default api.withTRPC(MyApp);
