import { enUS, ptBR } from '@clerk/localizations'
import { ClerkProvider } from '@clerk/nextjs'
import ErrorBoundary from '@components/hoc/ErrorBoundary'
import usePersistQueryClient from '@hooks/usePersistQueryClient'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Analytics } from '@vercel/analytics/react'
import useTranslation from 'next-translate/useTranslation'
import { type AppType } from 'next/app'
import { useSSRIntercept } from '../hooks/useSSRIntercept'
import '../styles/globals.css'
import { api } from '../utils/api'

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  useSSRIntercept() // makes all gssp run only once
  usePersistQueryClient()
  const { lang } = useTranslation()
  const localization = enUS.locale === lang ? enUS : ptBR
  return (
    <>
      <ClerkProvider {...pageProps} localization={localization}>
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
        <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
      </ClerkProvider>
      <Analytics />
    </>
  )
}

export { reportWebVitals } from 'next-axiom'
export default api.withTRPC(MyApp)
