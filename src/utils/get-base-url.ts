import { env } from '../env.mjs'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '' // browser should use relative url
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}` // SSR should use vercel url
  if (env.LOCALHOST_HTTPS) return `https://localhost:${env.PORT ?? 3000}` // dev SSR should use localhost with https
  return `http://localhost:${env.PORT ?? 3000}` // dev SSR should use localhost with http
}

export default getBaseUrl
