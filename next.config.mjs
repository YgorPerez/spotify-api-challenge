import NextBundleAnalyzer from '@next/bundle-analyzer';
import { withAxiom } from 'next-axiom';
import nextTranslate from 'next-translate-plugin';
import { env } from './src/env.mjs';

const bundleAnalyzer = NextBundleAnalyzer({
  enabled: env.ANALYZE == true,
});

/** @type {import("next").NextConfig} */
const config ={
    reactStrictMode: true,
    ...nextTranslate(),
    swcMinify: true,
    optimizeFonts: true,
    images: {
      domains: ['i.scdn.co', 'api.spotify.com', 'api.clerk.dev', 'google.com'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'i.scdn.co',
        },
      ],
      minimumCacheTTL: 1500000,
    },
    eslint: {
      dirs: ['src'],
    },
    sassOptions: {
      includePaths: ['./src/styles'],
    },
  }

export default bundleAnalyzer(withAxiom(config));
