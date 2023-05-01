import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;
declare global {
    var __db: PrismaClient | undefined
}

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
    prisma.$connect;
} else {
    if(!global.__db) {
        global.__db = new PrismaClient({log: ['query', 'error', 'warn', 'info']});
        global.__db.$connect;
    }
    prisma = global.__db;
}


console.log("prisma: DB connected");
export { prisma };
