import { type DefaultSeoProps } from 'next-seo';
import homePreview from './public/images/home-preview.webp';

const config: DefaultSeoProps = {
  defaultTitle: 'Listen to Spotify songs',
  themeColor: '#fafafa',
  robotsProps: {
    notranslate: false,
    maxImagePreview: 'large',
    noarchive: true,
  },
  openGraph: {
    title: 'Listen to Spotify songs',
    type: 'website',
    description:
      "Search for artists, albums or tracks and listen to the songs previews while reading it's lyrics",
    locale: 'en-US',
    siteName: 'Music Api Challenge',
    images: [
      {
        url: homePreview.src,
        alt: 'home image preview',
        width: homePreview.width,
        height: homePreview.height,
      },
    ],
  },
  additionalLinkTags: [
    {
      rel: 'icon',
      href: './public/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: './public/favicon.ico',
      sizes: '64x64',
    },
    { rel: 'manifest', href: './manifest.json' },
  ],
  twitter: {
    handle: '@ygorperez',
    site: '@ygorperez',
    cardType: 'summary_large_image',
  },
};

export default config;
