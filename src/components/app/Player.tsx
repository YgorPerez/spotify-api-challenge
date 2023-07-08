import formatText from '@utils/formatText';
import useTranslation from 'next-translate/useTranslation';
import { useState, type FC } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { type SimplifiedTrack } from 'spotify-web-api-ts-edge/types/types/SpotifyObjects';
import { useMediaQuery } from 'usehooks-ts';

const Player: FC<{
  songList: SimplifiedTrack[];
}> = ({ songList }) => {
  const [currentSongIndex, setSongIndex] = useState(0);
  const { t } = useTranslation();
  const isXs = useMediaQuery('(max-width: 640px)');
  const textLength = isXs ? 45 : 70;

  const goToNextSong = () => {
    setSongIndex(currentSongIndex =>
      currentSongIndex < songList.length - 1 ? currentSongIndex + 1 : 0,
    );
  };

  const goToPreviousSong = () => {
    setSongIndex(currentSongIndex =>
      currentSongIndex > 0 ? currentSongIndex - 1 : 0,
    );
  };

  const currentSong = songList[currentSongIndex];
  const songSource = currentSong?.preview_url;
  const isPlaylist = songList.length > 1;

  return (
    <div className='fixed bottom-0 w-full bg-dark-gray pt-2'>
      {songSource ? (
        <div>
          <p className='w-full text-center text-2xl text-white'>
            {isPlaylist && (
              <span className='text-gray-400'>{currentSongIndex + 1}. </span>
            )}
            {formatText(currentSong.name, textLength)}
          </p>
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
        </div>
      ) : (
        <p className='mb-16 w-full text-center text-2xl text-white'>
          {t('common:this')} {isPlaylist ? 'album' : t('common:song')}{' '}
          {t('common:no-song-preview')}
        </p>
      )}
    </div>
  );
};

export default Player;
