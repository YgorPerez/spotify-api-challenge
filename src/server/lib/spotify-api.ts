import { TRPCError } from '@trpc/server'
import { Client } from 'spotify-api.js'
import { prisma } from './db'

export const globalForSpotifyClient = globalThis as unknown as {
  spotifyClient: Client
}

export const spotifyClient = (
  accessToken: string,
  clientId: string,
  clientSecret: string,
  refreshToken: string,
  redirectUrl: string,
) => {
  return (
    globalForSpotifyClient.spotifyClient ||
    new Client({
      token: {
        token: accessToken,
        clientID: clientId,
        clientSecret,
        refreshToken,
        redirectURL: redirectUrl,
      },
      refreshToken: true,
      cacheSettings: {
        albums: true,
        tracks: true,
        artists: true,
      },
      async onRefresh() {
        const ACCESS_TOKEN_EXPIRES_IN_S = 3600
        const accessTokenExpiresAt =
          Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRES_IN_S
        const newRefreshToken =
          globalForSpotifyClient.spotifyClient.refreshMeta?.refreshToken
        const newAccessToken = globalForSpotifyClient.spotifyClient.token
        await prisma.account.update({
          data: {
            access_token: newRefreshToken,
            refresh_token: newAccessToken,
            expires_at: accessTokenExpiresAt,
          },
          where: {
            access_token: newAccessToken,
          },
        })
        console.log('database updated with the accessToken ', newAccessToken)
      },
      onFail(error) {
        throw new TRPCError({
          message: `spotify-api.js error: ${error.message}`,
          code: 'INTERNAL_SERVER_ERROR',
          cause: error.cause,
        })
      },
    })
  )
}
