import { PrismaClient } from '@prisma/client'
import { env } from '../../env.mjs'
import { cacheMiddleware } from './redis-cache-middleware'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['info', 'error', 'warn'] : ['error'],
  })

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

if (env.NODE_ENV === 'production') {
  // to use the redis cache
  prisma.$use(cacheMiddleware)
}
