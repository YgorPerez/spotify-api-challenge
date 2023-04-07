import { SpotifyWebApi } from 'spotify-web-api-ts/src'
import { env } from '../../env.mjs'

export const globalForSpotifyClient = globalThis as unknown as {
  spotifyApi: SpotifyWebApi
}

export const spotifyClientOauth = (accessToken: string) => {
  return (
    globalForSpotifyClient.spotifyApi ||
    new SpotifyWebApi({
      accessToken: accessToken,
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
      redirectUri: env.CLERK_REDIRECT_URI,
  })
  )
}
