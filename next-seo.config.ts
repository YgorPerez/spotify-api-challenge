import { type DefaultSeoProps } from 'next-seo';

const config: DefaultSeoProps = {
  canonical: 'https://music-api-challenge.vercel.app/',
  themeColor: '#fafafa',
  robotsProps: {
    notranslate: false,
    maxImagePreview: 'large',
    noarchive: true,
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
