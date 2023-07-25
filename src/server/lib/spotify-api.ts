import { SpotifyWebApi } from 'spotify-web-api-ts-edge';
import { env } from '../../env.mjs';

export const globalForSpotifyClient = globalThis as unknown as {
  spotifyApi: SpotifyWebApi;
};

export const spotifyClientOauth = (accessToken?: string) => {
  globalForSpotifyClient.spotifyApi = new SpotifyWebApi({
    accessToken: accessToken,
    clientId: env.SPOTIFY_CLIENT_ID,
    clientSecret: env.SPOTIFY_CLIENT_SECRET,
  });

  return globalForSpotifyClient.spotifyApi;
};
