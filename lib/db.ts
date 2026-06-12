import { PrismaClient } from '@prisma/client'

// Use a global variable that persists across Next.js hot-reloads
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const getPrisma = (): PrismaClient => {
  if (!globalForPrisma.prisma) {
    // 1. Check if DATABASE_URL exists right when the API is hit
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is missing from environment variables.")
    }

    // 2. Safely initialize Prisma Client
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  }
  
  return globalForPrisma.prisma
}