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
      name: 'view-transition',
      content: 'same-origin',
    },
  ],
  twitter: {
    handle: '@ygorperez',
    site: '@ygorperez',
    cardType: 'summary_large_image',
  },
};

export default config;
