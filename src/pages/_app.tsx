import { ClerkProvider } from '@clerk/nextjs'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Analytics } from '@vercel/analytics/react'
import { type AppType } from 'next/app'
import { lazy, Suspense, useEffect, useState } from 'react'
import ErrorBoundary from '../components/ErrorBoundary'
import '../styles/globals.css'
import { api } from '../utils/api'

if (process.env.NODE_ENV === 'development') {
  void import('@impulse.dev/runtime').then(impulse => impulse.run())
}

const ReactQueryDevtoolsProduction = lazy(() =>
  import('@tanstack/react-query-devtools/build/lib/index.prod.js').then(d => ({
    default: d.ReactQueryDevtools,
  })),
)

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  const [showDevtools, setShowDevtools] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.toggleDevtools = () => setShowDevtools(old => !old)
  }, [])
  // this way the react query devtools can be downloaded in production using window.toggleDevtools() on console
  // trpc already adds the query client provider
  return (
    <>
    <ClerkProvider {...pageProps}>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
      <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
      {showDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </Suspense>
      )}
    </ClerkProvider>
    <Analytics/>
    </>
  )
}

export { reportWebVitals } from 'next-axiom'
export default api.withTRPC(MyApp)
