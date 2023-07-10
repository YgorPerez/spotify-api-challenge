import { type DefaultSeoProps } from 'next-seo';
import homePreview from '/public/images/home-preview.png';

const config: DefaultSeoProps = {
  defaultTitle: 'Listen to Spotify',
  openGraph: {
    title: 'Songs online',
    type: 'website',
    description:
      "Search for artists, albums or tracks and listen to the songs previews while reading it's lyrics",
    locale: 'en-US',
    siteName: 'Spotify in T3',
    images: [
      {
        url: homePreview.src,
        alt: 'home image preview',
        width: homePreview.width,
        height: homePreview.height,
      },
    ],
  },
  canonical: 'spotify-api-challenge.vercel.app',
  twitter: {
    handle: '@ygorperez',
    site: '@ygorperez',
    cardType: 'summary_large_image',
  },
};

export default config;
