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
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'default',
    },
    {
      name: 'apple-mobile-web-app-title',
      content: 'Music Api Challenge',
    },
    {
      name: 'format-detection',
      content: 'telephone=no',
    },
    {
      name: 'mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'msapplication-config',
      content: '/public/browserconfig.xml',
    },
    {
      name: 'msapplication-TileColor',
      content: '#fafafa',
    },
    {
      name: 'theme-color',
      content: '#fafafa',
    },
    {
      name: 'viewport',
      content:
        'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover',
    },
    {
      name: 'stylesheet',
      content: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500',
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
      href: '/public/images/touch-icon-ipad.png',
      type: 'image/png',
    },
    {
      rel: 'apple-touch-icon',
      href: '/public/images/touch-icon-ipad.png',
      type: 'image/png',
      sizes: '152x152',
    },
    {
      rel: 'apple-touch-icon',
      href: '/public/images/touch-icon-iphone-retina.png',
      type: 'image/png',
      sizes: '180x180',
    },
    {
      rel: 'apple-touch-icon',
      href: '/public/images/touch-icon-ipad-retina.png',
      type: 'image/png',
      sizes: '167x167',
    },
    {
      rel: 'manifest',
      href: '/public/manifest.json',
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
