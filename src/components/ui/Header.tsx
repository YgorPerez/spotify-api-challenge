import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import spotifyLogo from '/public/images/spotify-app-logo.webp'

const Header: React.FC = () => {
  return (
    <header className="w-16 h-16 pt-8">
      <div className='ml-6 block'>
        <Link href={`/`}>
          <Image src={spotifyLogo} width="64" height="64" alt="Spotify logo"/>
        </Link>
      </div>
    </header>
  )
}

export default Header
