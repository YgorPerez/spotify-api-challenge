import { env } from '@/env.mjs';
import { UserTokenSchema } from '@schema/clerkSchemas';
import { TRPCError } from '@trpc/server';
import { redis } from './redis';

const getSpotifyToken = async ({
  userId = 'user_2NyeeLQSg6TEJ88FxsHm3GDUecb',
}: {
  userId?: string;
}) => {
  const cachedToken = await redis.get(userId);
  if (cachedToken !== '' && cachedToken && typeof cachedToken === 'string') {
    return cachedToken;
  }

  const userTokenResponse = await fetch(
    `https://api.clerk.dev/v1/users/${userId}/oauth_access_tokens/oauth_spotify`,
    {
      method: 'get',
      headers: new Headers({
        Authorization: `Bearer ${env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    },
  );
  if (!userTokenResponse.ok) {
    throw new TRPCError({
      message: `Response error on fetch access token from user: ${userId}`,
      code: 'INTERNAL_SERVER_ERROR',
    });
  }

  const userToken = await userTokenResponse.json();

  const validatedUserToken = UserTokenSchema.safeParse(userToken);
  if (!validatedUserToken.success || !validatedUserToken.data[0]?.token) {
    throw new TRPCError({
      message: `User token not found id: ${userId}`,
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
  const token = validatedUserToken.data[0]?.token;
  const ONE_HOUR_IN_SECONDS = 60 * 60;
  await redis.set(userId, token, { ex: ONE_HOUR_IN_SECONDS });

  return token;
};

export default getSpotifyToken;
