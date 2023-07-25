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
import Head from 'next/head';
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
        }}
      />
      <Head>
        <link rel='manifest' href='/public/manifest.json' />
        <link rel='apple-touch-icon' href='/public/images/favicon-32x32.png' />
        <link
          rel='apple-touch-icon'
          sizes='152x152'
          href='/public/images/touch-icon-ipad.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/public/images/touch-icon-iphone-retina.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='167x167'
          href='/public/images/touch-icon-ipad-retina.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/public/images/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/public/images/favicon-16x16.png'
        />
        <link
          rel='shortcut'
          type='image/png'
          sizes='16x16'
          href='/public/images/favicon-16x16.png'
        />
        <link
          rel='mask-icon'
          type='image/png'
          sizes='16x16'
          color='#fafafa'
          href='/public/images/favicon-16x16.png'
        />
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
        />
        <meta
          property='og:image'
          content='/public/images/home-preview-cropped.png'
        />
      </Head>
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
