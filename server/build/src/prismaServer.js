"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
let prisma;
exports.prisma = prisma;
if (process.env.NODE_ENV === 'production') {
    exports.prisma = prisma = new client_1.PrismaClient();
    prisma.$connect;
}
else {
    if (!global.__db) {
        global.__db = new client_1.PrismaClient({ log: ['query', 'error', 'warn', 'info'] });
        global.__db.$connect;
    }
    exports.prisma = prisma = global.__db;
}
console.log("prisma: DB connected");
