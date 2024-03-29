import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION &&
    process.env.SKIP_ENV_VALIDATION !== 'false' &&
    process.env.SKIP_ENV_VALIDATION !== '0',
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT: z.string().url().optional(),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string(),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string(),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string(),
  },
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    VERCEL_URL: z.string().optional(),
    SPOTIFY_CLIENT_ID: z.string(),
    SPOTIFY_CLIENT_SECRET: z.string(),
    SPOTIFY_REFRESH_TOKEN: z.string().optional(),
    CLERK_SECRET_KEY: z.string(),
    GENIUS_CLIENT_SECRET: z.string(),
    GENIUS_ACCESS_TOKEN: z.string(),
    CLERK_REDIRECT_URI: z.string().url(),
    REDIS_URL: z.string().url(),
    PORT: z
      .string()
      .optional()
      .transform(s => parseInt(s || '3000', 10))
      // make sure transform worked
      .pipe(z.number()),

    ANALYZE: z
      .string()
      .optional()
      // only allow "true" or "false" and "undefined"
      .refine(s => s === 'true' || s === 'false' || typeof s === 'undefined')
      // transform to boolean
      .transform(s => s === 'true'),
  },
  runtimeEnv: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL:
      process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL:
      process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT:
      process.env.NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    GENIUS_ACCESS_TOKEN: process.env.GENIUS_ACCESS_TOKEN,
    GENIUS_CLIENT_SECRET: process.env.GENIUS_CLIENT_SECRET,
    CLERK_REDIRECT_URI: process.env.CLERK_REDIRECT_URI,
    REDIS_URL: process.env.REDIS_URL,
    PORT: process.env.PORT,
    ANALYZE: process.env.ANALYZE,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
  },
});
