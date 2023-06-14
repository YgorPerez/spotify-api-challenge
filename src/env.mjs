import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION &&
    process.env.SKIP_ENV_VALIDATION !== 'false' &&
    process.env.SKIP_ENV_VALIDATION !== '0',
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  },
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    VERCEL_URL: z.string().url().optional(),
    SPOTIFY_CLIENT_ID: z.string(),
    SPOTIFY_CLIENT_SECRET: z.string(),
    SPOTIFY_REFRESH_TOKEN: z.string().optional(),
    CLERK_SECRET_KEY: z.string(),
    CLERK_REDIRECT_URI: z.string().url(),
    PORT: z
      .string()
      .optional()
      .transform(s => parseInt(s || '3000', 10))
      // make sure transform worked
      .pipe(z.number()),

    ANALYZE: z
      .string()
      .optional()
      // only allow "true" or "false"
      .refine(s => s === 'true' || s === 'false')
      // transform to boolean
      .transform(s => s === 'true'),
  },
  runtimeEnv: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_REDIRECT_URI: process.env.CLERK_REDIRECT_URI,
    PORT: process.env.PORT,
    ANALYZE: process.env.ANALYZE,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
  },
})
