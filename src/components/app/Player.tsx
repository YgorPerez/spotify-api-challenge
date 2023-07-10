/* eslint-disable @next/next/no-css-tags */
import { api } from '@utils/api';
import useTranslation from 'next-translate/useTranslation';
import dynamic from 'next/dynamic';
import { useState, type FC } from 'react';
import { type SimplifiedTrack } from 'spotify-web-api-ts-edge/types/types/SpotifyObjects';

const SpotifyPlayer = dynamic(() => import('react-spotify-web-playback'), {
  loading: () => <p>Loading...</p>,
});
const AudioPlayer = dynamic(() => import('react-h5-audio-player'), {
  loading: () => <p>Loading...</p>,
});
const Head = dynamic(() => import('next/head'));

const Player: FC<{
  tracks: SimplifiedTrack[];
}> = ({ tracks: tracks }) => {
  const [currentSongIndex, setSongIndex] = useState(0);
  const { t } = useTranslation();

  const { data: user } = api.spotify.getUser.useQuery();
  const { data: token } = api.spotify.getAccessToken.useQuery();

  const uris = tracks.map(track => {
    return track.uri;
  });

  let isPremium = false;

  if (user) {
    isPremium = user.product === 'premium';
  }

  const goToNextSong = () => {
    setSongIndex(currentSongIndex =>
      currentSongIndex < tracks.length - 1 ? currentSongIndex + 1 : 0,
    );
  };

  const goToPreviousSong = () => {
    setSongIndex(currentSongIndex =>
      currentSongIndex > 0 ? currentSongIndex - 1 : tracks.length - 1,
    );
  };

  const currentSong = tracks[currentSongIndex];
  const songSource = currentSong?.preview_url;
  const isPlaylist = tracks.length > 1;

  return (
    <div className='fixed bottom-0 w-full bg-background pt-2'>
      {songSource || (isPremium && currentSong) ? (
        <div>
          <p className='w-full overflow-hidden text-ellipsis text-center text-2xl'>
            {isPlaylist && (
              <span className='text-gray-400'>{currentSongIndex + 1}. </span>
            )}
            {currentSong.name}
          </p>
          {isPremium ? (
            <SpotifyPlayer
              token={token as string}
              uris={uris}
              initialVolume={0.4}
            />
          ) : (
            <>
              <Head>
                <link href='/player.css' rel='stylesheet' />
              </Head>
              <AudioPlayer
                preload='metadata'
                src={songSource}
                showSkipControls={isPlaylist}
                volume={0.3}
                onClickNext={goToNextSong}
                onClickPrevious={goToPreviousSong}
                onEnded={goToNextSong}
                footer
              />
            </>
          )}
        </div>
      ) : (
        <p className='mb-10 w-full text-center text-xl sm:text-2xl'>
          {t('common:this')} {isPlaylist ? t('common:album') : t('common:song')}{' '}
          {t('common:no-song-preview')}
        </p>
      )}
    </div>
  );
};

export default Player;
