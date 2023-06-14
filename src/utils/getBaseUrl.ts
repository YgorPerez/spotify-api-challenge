import { env } from '@/env.mjs'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '' // browser will use relative url
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  else return `https://${env.VERCEL_URL}` // SSR should use vercel url
}

export default getBaseUrl
