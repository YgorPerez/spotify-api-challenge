import NextBundleAnalyzer from '@next/bundle-analyzer';
import { withAxiom } from 'next-axiom';
import nextTranslate from 'next-translate-plugin';
import { createRequire } from 'node:module';
import { env } from './src/env.mjs';
const require = createRequire(import.meta.url);

const bundleAnalyzer = NextBundleAnalyzer({
  enabled: env.ANALYZE == true,
});

/**
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import("next").NextConfig} */
const config = withPWA(
  defineNextConfig({
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
  }),
);

export default bundleAnalyzer(withAxiom(config));
