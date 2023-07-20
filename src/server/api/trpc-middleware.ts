import { getSpotifyToken } from '@lib/getClerkSpotifyToken';
import { ratelimiter } from '@lib/redis-ratelimit';
import { globalForSpotifyClient, spotifyClientOauth } from '@lib/spotify-api';
import { TRPCError } from '@trpc/server';
import { t } from './trpc';

const unauthorizedError = () => {
  return new TRPCError({
    message: 'you need to be logged in first',
    code: 'UNAUTHORIZED',
  });
};

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  const userId = ctx.auth.userId;
  if (!userId) {
    throw unauthorizedError();
  }
  await ratelimiter({ userId, event: ctx.event });
  return next({
    ctx: {
      ...ctx,
      // infers the `auth` as non-nullable
      auth: {
        ...ctx.auth,
        user: ctx.auth.user,
      },
    },
  });
});

const IsAccessTokenValid = t.middleware(async ({ ctx, next }) => {
  const userId = ctx.auth.userId;
  if (!userId) {
    throw unauthorizedError();
  }
  await ratelimiter({ userId, event: ctx.event });

  let spotifyApi = globalForSpotifyClient.spotifyApi;
  if (!globalForSpotifyClient.spotifyApi) {
    spotifyApi = spotifyClientOauth(await getSpotifyToken(userId));
  }
  return next({
    ctx: {
      ...ctx,
      // infers the `auth` as non-nullable
      auth: {
        ...ctx.auth,
        user: {
          ...ctx.auth?.user,
        },
      },
      spotifyApi: spotifyApi,
    },
  });
});

export const protectedTokenProcedure = t.procedure.use(IsAccessTokenValid);
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
