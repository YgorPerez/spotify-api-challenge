import { Account } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { Client } from 'spotify-api.js'
import { env } from '../../env.mjs'
import { prisma } from './db'

export const globalForSpotifyClient = globalThis as unknown as {
  spotifyClient: Client
}

export const spotifyClient = (userAccount: Account) => {
  return (
    globalForSpotifyClient.spotifyClient ||
    new Client({
      token: {
        token: userAccount.access_token as string,
        clientID: env.SPOTIFY_CLIENT_ID,
        clientSecret: env.SPOTIFY_CLIENT_SECRET,
        refreshToken: userAccount.refresh_token as string,
        redirectURL: env.NEXTAUTH_URL,
      },
      cacheSettings: {
        albums: true,
        tracks: true,
        artists: true,
      },
      refreshToken: true,
      userAuthorizedToken: true,
      onReady(client) {
        console.log('Client started')
        client.refreshMeta = {
          clientID: env.SPOTIFY_CLIENT_ID,
          clientSecret: env.SPOTIFY_CLIENT_SECRET,
          refreshToken: userAccount.refresh_token as string,
          redirectURL: env.NEXTAUTH_URL,
        }
      },
      async onRefresh() {
        const ACCESS_TOKEN_EXPIRES_IN_S = 3600
        const nowInSeconds = Math.floor(Date.now() / 1000)
        const accessTokenExpiresAt = nowInSeconds + ACCESS_TOKEN_EXPIRES_IN_S

        const client = globalForSpotifyClient.spotifyClient
        const accessToken = client.auth.token
        const refreshToken = client.refreshMeta?.refreshToken as string

        await prisma.account.update({
          data: {
            access_token: accessToken,
            expires_at: accessTokenExpiresAt,
            refresh_token: refreshToken,
          },
          where: {
            provider_providerAccountId: {
              provider: 'spotify',
              providerAccountId: client.user.id,
            },
          },
        })
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
