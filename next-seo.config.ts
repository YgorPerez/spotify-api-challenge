import { type DefaultSeoProps } from 'next-seo';

const config: DefaultSeoProps = {
  defaultTitle: 'Listen to Spotify songs',
  canonical: 'https://music-api-challenge.vercel.app/',
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
        url: 'https://i.imgur.com/XlwJ2ue.png',
        alt: 'home image preview',
        width: 1920,
        height: 1080,
      },
      {
        url: 'https://i.imgur.com/9uuDwGJ.png',
        alt: 'home image preview, cropped to fit',
        width: 1200,
        height: 630,
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
  ],
  twitter: {
    handle: '@ygorperez',
    site: '@ygorperez',
    cardType: 'summary_large_image',
  },
};

export default config;
