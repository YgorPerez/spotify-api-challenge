import { useState, type FC } from 'react'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'
import { type SimplifiedTrack } from 'spotify-web-api-ts-edge/types/types/SpotifyObjects'

const Player: FC<{
  songList: SimplifiedTrack[]
  showSkipControls?: boolean
}> = ({ songList, showSkipControls = false }) => {
  const [currentSongIndex, setSongIndex] = useState(0)

  const goToNextSong = () => {
    setSongIndex(currentSongIndex =>
      currentSongIndex < songList.length - 1 ? currentSongIndex + 1 : 0,
    )
  }

  const goToPreviousSong = () => {
    setSongIndex(currentSongIndex =>
      currentSongIndex > 0 ? currentSongIndex - 1 : 0,
    )
  }

  const currentSong = songList[currentSongIndex]
  const songSource = currentSong?.preview_url

  return (
    <div>
      {songSource ? (
        <div>
          <p className='fixed bottom-24 w-full text-center text-2xl text-white'>
            {songList.length > 1 && (
              <span className='text-gray-400'>{currentSongIndex + 1}. </span>
            )}
            {currentSong.name}
          </p>
          <AudioPlayer
            preload='metadata'
            className='fixed bottom-0'
            src={songSource}
            showSkipControls={showSkipControls}
            volume={0.3}
            onClickNext={goToNextSong}
            onClickPrevious={goToPreviousSong}
            onEnded={goToNextSong}
            footer
          />
        </div>
      ) : (
        <p className='fixed bottom-24 w-full text-center text-2xl text-white'>
          This song doesn&apos;t have a preview available
        </p>
      )}
    </div>
  )
}

export default Player
