import { PrismaClient } from "@prisma/client";

// One shared client in dev (Next.js hot reload would otherwise open many DB connections)
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
