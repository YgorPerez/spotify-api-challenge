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
      name: 'application-name',
      content: 'Music Api Challenge',
    },
    {
      name: 'google-site-verification',
      content: 'knf0tBoTfCXjTWRmnCUDA5u-YHXtAD5fLY4YZizy1P4',
    },
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
      type: 'image/png',
    },
    {
      rel: 'apple-touch-icon',
      href: 'https://i.imgur.com/0DSX3j2.png',
      type: 'image/png',
      sizes: '152x152',
    },
    {
      rel: 'apple-touch-icon',
      href: 'https://i.imgur.com/3KqOPnF.png',
      type: 'image/png',
      sizes: '180x180',
    },
    {
      rel: 'apple-touch-icon',
      href: 'https://i.imgur.com/NIOAiwY.png',
      type: 'image/png',
      sizes: '167x167',
    },
    {
      rel: 'shortcut',
      href: 'https://i.imgur.com/DXIslqf.png',
    },
    {
      rel: 'mask-icon',
      href: 'https://i.imgur.com/DXIslqf.png',
      color: '#fafafa',
    },
  ],
  twitter: {
    handle: '@ygorperez',
    site: '@ygorperez',
    cardType: 'summary_large_image',
  },
};

export default config;
