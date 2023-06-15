import NextBundleAnalyzer from '@next/bundle-analyzer'
import { withAxiom } from 'next-axiom'
import { env } from './src/env.mjs'

const bundleAnalyzer = NextBundleAnalyzer({
  enabled: env.ANALYZE == true,
})

/** @type {import("next").NextConfig} */
const config = withAxiom({
  reactStrictMode: true,
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  swcMinify: true,
  optimizeFonts: true,
  images: {
    domains: ['i.scdn.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
    ],
    minimumCacheTTL: 1500000,
  },
})

export default bundleAnalyzer(config)
