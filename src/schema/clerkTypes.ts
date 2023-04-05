export type UserToken = [
  {
    object: string
    token: string
    provider: string
    label: string | null
    scopes: string[]
    token_secret?: string
  },
]
