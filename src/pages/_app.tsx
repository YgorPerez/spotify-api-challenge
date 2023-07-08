import { ClerkProvider } from '@clerk/nextjs';
import ErrorBoundary from '@components/hoc/ErrorBoundary';
import usePersistQueryClient from '@hooks/usePersistQueryClient';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from 'next-themes';
import { type AppType } from 'next/app';
import { useSSRIntercept } from '../hooks/useSSRIntercept';
import '../styles/globals.css';
import { api } from '../utils/api';

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  useSSRIntercept(); // makes all gssp run only once
  usePersistQueryClient();
  return (
    <>
      <ClerkProvider {...pageProps}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
          <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
        </ThemeProvider>
      </ClerkProvider>
      <Analytics />
    </>
  );
};

export { reportWebVitals } from 'next-axiom';
export default api.withTRPC(MyApp);
