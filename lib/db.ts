import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import "dotenv/config";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const getPrisma = (): PrismaClient => {
  if (!globalForPrisma.prisma) {
    // For serverless routes, we want the runtime to utilize the Pooled connection URL
    const connectionString = process.env.DATABASE_URL_POOL;

    if (!connectionString) {
      throw new Error("DATABASE_URL_POOL is not set in environment variables");
    }

    // Pass the pooled connection string into the Neon Serverless driver adapter
    const adapter = new PrismaNeon({ connectionString });

    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });
  }

  return globalForPrisma.prisma;
};