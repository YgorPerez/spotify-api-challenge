import { type Account } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import SpotifyWebApi from 'spotify-web-api-node'
import { env } from '../../env.mjs'
import { prisma } from './db'

export const globalForSpotifyApi = globalThis as unknown as {
  spotifyApi: SpotifyWebApi
  expiresAt: number
}

export const spotifyWebApi = (userAccount: Account) => {
  if (!globalForSpotifyApi.spotifyApi) {
    globalForSpotifyApi.spotifyApi = new SpotifyWebApi({
      accessToken: userAccount.access_token as string,
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
      refreshToken: userAccount.refresh_token as string,
      redirectUri: env.NEXTAUTH_URL,
    })
    refreshAccessToken(userAccount)
  }
  return globalForSpotifyApi.spotifyApi
}

export const refreshAccessToken = (userAccount: Account) => {
  globalForSpotifyApi.spotifyApi.refreshAccessToken().then(
    async data => {
      const accessToken = data.body.access_token
      const refreshToken = data.body.refresh_token
      globalForSpotifyApi.spotifyApi.setAccessToken(accessToken)
      refreshToken &&
        globalForSpotifyApi.spotifyApi.setRefreshToken(refreshToken)

      const nowInSeconds = Math.floor(Date.now() / 1000)
      const accessTokenExpiresAt = nowInSeconds + data.body.expires_in
      globalForSpotifyApi.expiresAt = accessTokenExpiresAt

      const { body: userSpotifyProfile } =
        await globalForSpotifyApi.spotifyApi.getMe()

      // iife
      void (async () => {
        try {
          await prisma.account.update({
            data: {
              access_token: accessToken,
              expires_at: accessTokenExpiresAt,
              refresh_token: refreshToken || userAccount.refresh_token,
            },
            where: {
              provider_providerAccountId: {
                provider: 'spotify',
                providerAccountId: userSpotifyProfile.id,
              },
            },
          })
        } catch (error) {
          throw new TRPCError({
            message: `erron on spotify-web-api on prisma update `,
            code: 'INTERNAL_SERVER_ERROR',
            cause: error,
          })
        }
      })()
    },
    err => {
      throw new TRPCError({
        message: `erron on spotify-web-api on refresh`,
        code: 'INTERNAL_SERVER_ERROR',
        cause: err,
      })
    },
  )
}
