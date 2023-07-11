import { type DefaultSeoProps } from 'next-seo';
import homePreviewCropped from './public/images/home-preview-cropped.png';
import homePreview from './public/images/home-preview.png';

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
      {
        url: homePreviewCropped.src,
        alt: 'home image preview, cropped to fit',
        width: homePreviewCropped.width,
        height: homePreviewCropped.height,
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
