import { api } from '@utils/api';
import formatText from '@utils/formatText';
import useTranslation from 'next-translate/useTranslation';
import { useState, type FC } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import SpotifyPlayer from 'react-spotify-web-playback';
import { type SimplifiedTrack } from 'spotify-web-api-ts-edge/types/types/SpotifyObjects';
import { useMediaQuery } from 'usehooks-ts';

const Player: FC<{
  tracks: SimplifiedTrack[];
}> = ({ tracks: tracks }) => {
  const [currentSongIndex, setSongIndex] = useState(0);
  const { t } = useTranslation();
  const isSmallerSM = useMediaQuery('(max-width: 639px)');
  const textLength = isSmallerSM ? 45 : 70;

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
          <p className='w-full text-center text-2xl'>
            {isPlaylist && (
              <span className='text-gray-400'>{currentSongIndex + 1}. </span>
            )}
            {formatText(currentSong.name, textLength)}
          </p>
          {isPremium ? (
            <SpotifyPlayer token={token as string} uris={uris} />
          ) : (
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
          )}
        </div>
      ) : (
        <p className='mb-16 w-full text-center text-2xl'>
          {t('common:this')} {isPlaylist ? t('common:album') : t('common:song')}{' '}
          {t('common:no-song-preview')}
        </p>
      )}
    </div>
  );
};

export default Player;
