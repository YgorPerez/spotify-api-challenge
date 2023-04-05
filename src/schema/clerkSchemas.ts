import { z } from 'zod'

export const UserTokenSchema = z.array(
  z.object({
    object: z.string(),
    token: z.string(),
    provider: z.string(),
    label: z.string().nullable(),
    scopes: z.array(z.string()),
    token_secret: z.string().optional(),
  }),
)
