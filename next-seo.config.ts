import { type DefaultSeoProps } from 'next-seo';
import favicon from '/public/favicon.ico';
import homePreview from '/public/images/home-preview.webp';

const config: DefaultSeoProps = {
  defaultTitle: 'Listen to Spotify musics',
  themeColor: '#fafafa',
  robotsProps: {
    notranslate: false,
  },
  openGraph: {
    title: 'Songs online',
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
      href: favicon.src,
    },
    {
      rel: 'apple-touch-icon',
      href: favicon.src,
      sizes: '64x64',
    },
    { rel: 'manifest', href: '/manifest.json' },
  ],
  canonical: 'spotify-api-challenge.vercel.app',
  twitter: {
    handle: '@ygorperez',
    site: '@ygorperez',
    cardType: 'summary_large_image',
  },
};

export default config;
