import getSpotifyToken from '@lib/getSpotifyToken';
import ratelimit from '@lib/ratelimit';
import { globalForSpotifyClient, spotifyClientOauth } from '@lib/spotify-api';
import { t } from './trpc';

const IsAccessTokenValid = t.middleware(async ({ ctx, next }) => {
  if (ctx.ip) {
    await ratelimit({ userId: ctx.ip, event: ctx.event });
  }

  let spotifyApi = globalForSpotifyClient.spotifyApi;
  if (!globalForSpotifyClient.spotifyApi) {
    spotifyApi = spotifyClientOauth(await getSpotifyToken({}));
  }
  return next({
    ctx: {
      ...ctx,
      spotifyApi: spotifyApi,
    },
  });
});

export const protectedTokenProcedure = t.procedure.use(IsAccessTokenValid);
