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
        url: 'https://i.imgur.com/9uuDwGJ.png',
        alt: 'home image preview, cropped to fit',
        width: 1200,
        height: 630,
      },
    ],
  },
  additionalMetaTags: [
    {
      name: 'view-transition',
      content: 'same-origin',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: 'https://i.imgur.com/VdjeMM7.png',
      sizes: '32x32',
      type: 'image/png',
    },
    {
      rel: 'icon',
      href: 'https://i.imgur.com/DXIslqf.png',
      sizes: '16x16',
      type: 'image/png',
    },
    {
      rel: 'apple-touch-icon',
      href: 'https://i.imgur.com/VdjeMM7.png',
      sizes: '32x32',
      type: 'image/png',
    },
  ],

  twitter: {
    handle: '@ygorperez',
    site: '@ygorperez',
    cardType: 'summary_large_image',
  },
};

export default config;
