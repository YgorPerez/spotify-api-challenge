import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Analytics } from '@vercel/analytics/react'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'
import { lazy, Suspense, useEffect, useState } from 'react'
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

const MyApp: AppType<{
  session: Session | null
}> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const [showDevtools, setShowDevtools] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.toggleDevtools = () => setShowDevtools(old => !old)
  }, [])
  // this way the react query devtools can be downloaded in production using window.toggleDevtools() on console
  // trpc already adds the query client provider
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <Analytics />
      <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
      {showDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </Suspense>
      )}
    </SessionProvider>
  )
}

export { reportWebVitals } from 'next-axiom'
export default api.withTRPC(MyApp)
