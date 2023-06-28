import { useSignal } from '@preact/signals'
import { nullsToUndefined } from '@utils/NullsToUndefined'
import { type FC } from 'react'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'
import {
  type SimplifiedTrack,
  type Track,
} from 'spotify-web-api-ts-edge/types/types/SpotifyObjects'

const Player: FC<{ songList: Track[] | SimplifiedTrack[] }> = ({
  songList,
}) => {
  const currentTrackIndex = useSignal(0)

  const goToNextSong = () => {
    if (currentTrackIndex.value < songList.length - 1) {
      currentTrackIndex.value++
    }
  }

  const goToPreviousSong = () => {
    if (currentTrackIndex.value > 0) {
      currentTrackIndex.value--
    }
  }

  const songSource = nullsToUndefined(
    songList[currentTrackIndex.value]?.preview_url,
  )

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
