import "server-only";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForDb = globalThis as unknown as { prisma?: PrismaClient };
export function getDb(): PrismaClient {
  if (globalForDb.prisma) return globalForDb.prisma;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured. Set it and run migrations and seed before using the store.");
  const adapter = new PrismaPg({ connectionString, max: 5, connectionTimeoutMillis: 5000 });
  globalForDb.prisma = new PrismaClient({ adapter });
  return globalForDb.prisma;
}
