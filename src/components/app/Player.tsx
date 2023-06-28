import { nullsToUndefined } from '@utils/NullsToUndefined'
import { useState, type FC } from 'react'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'
import {
  type SimplifiedTrack,
  type Track,
} from 'spotify-web-api-ts-edge/types/types/SpotifyObjects'

const Player: FC<{ songList: Track[] | SimplifiedTrack[] }> = ({
  songList,
}) => {
  const [currentTrackIndex, setTrackIndex] = useState(0)

  const goToNextSong = () => {
    setTrackIndex(currentTrackIndex =>
      currentTrackIndex < songList.length - 1 ? currentTrackIndex + 1 : 0,
    )
  }

  const goToPreviousSong = () => {
    setTrackIndex(currentTrackIndex =>
      currentTrackIndex > 0 ? currentTrackIndex - 1 : 0,
    )
  }

  const songSource = nullsToUndefined(songList[currentTrackIndex]?.preview_url)

  return (
    <AudioPlayer
      className='fixed bottom-0 bg-black'
      preload='metadata'
      src={songSource}
      showSkipControls
      volume={0.3}
      onClickNext={goToNextSong}
      onClickPrevious={goToPreviousSong}
      onEnded={goToNextSong}
      footer
    />
  )
}

export default Player
