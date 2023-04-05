import { TRPCError } from '@trpc/server'
import { Client } from 'spotify-api.js'
import { env } from '../../env.mjs'

export const globalForSpotifyClient = globalThis as unknown as {
  spotifyClient: Client | boolean
}

export const spotifyClientOauth = (accessToken: string) => {
  return (
    globalForSpotifyClient.spotifyClient ||
    new Client({
      token: {
        token: accessToken,
        clientID: env.SPOTIFY_CLIENT_ID,
        clientSecret: env.SPOTIFY_CLIENT_SECRET,
        redirectURL: env.CLERK_REDIRECT_URI,
      },
      cacheSettings: {
        albums: false,
        tracks: false,
        artists: false,
      },
      userAuthorizedToken: true,
      retryOnRateLimit: true,
      onFail(error) {
        globalForSpotifyClient.spotifyClient = false
        throw new TRPCError({
          message: `Error on spotify-api.js: ${error.message}`,
          cause: error.cause,
          code: 'INTERNAL_SERVER_ERROR',
        })
      },
    })
  )
}
