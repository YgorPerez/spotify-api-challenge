import { ClerkProvider } from '@clerk/nextjs';
import usePersistQueryClient from '@hooks/usePersistQueryClient';
import useSSRIntercept from '@hooks/useSSRIntercept';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { api } from '@utils/api';
import { Analytics } from '@vercel/analytics/react';
import { DefaultSeo } from 'next-seo';
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
  weight: '400',
  subsets: ['latin'],
  variable: '--font-roboto',
  fallback: ['Segoe UI'],
});

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  usePersistQueryClient();
  useSSRIntercept(); // makes gssp run only once
  return (
    <>
      <DefaultSeo {...config} />
      <ClerkProvider {...pageProps}>
        <div className={roboto.className}>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <ErrorBoundary>
              <Component {...pageProps} />
            </ErrorBoundary>
            <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
          </ThemeProvider>
        </div>
      </ClerkProvider>
      <Analytics mode={'production'} />
    </>
  );
};

export { reportWebVitals } from 'next-axiom';
export default api.withTRPC(MyApp);
