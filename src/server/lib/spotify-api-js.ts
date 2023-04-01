import { type Account } from '@prisma/client'
import SpotifyWebApi from 'spotify-web-api-node'
import { env } from '../../env.mjs'

export const globalForSpotifyApi = globalThis as unknown as {
  spotifyApi: SpotifyWebApi
}

export const spotifyWebApi = (userAccount: Account) => {
  return (
    globalForSpotifyApi.spotifyApi ||
    new SpotifyWebApi({
      accessToken: userAccount.access_token as string,
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
      refreshToken: userAccount.refresh_token as string,
      redirectUri: env.NEXTAUTH_URL,
    })
  )
}
