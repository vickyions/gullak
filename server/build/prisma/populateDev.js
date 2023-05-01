"use strict";
// populate operations handle here
// run npx ts-node %
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const readline_1 = require("readline");
const prisma = new client_1.PrismaClient({ log: ["query", "error", "info", "warn"] });
const readline = (0, readline_1.createInterface)({
    input: process.stdin,
    output: process.stdout,
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // clear Everything
        yield prisma.transaction.deleteMany();
        yield prisma.category.deleteMany();
        yield prisma.wallet.deleteMany();
        yield prisma.user.deleteMany();
        const user = yield prisma.user.create({
            data: {
                email: "vic@gmail.com",
                name: "Vicky Soni",
                password: "vic1234",
                wallets: {
                    create: [
                        {
                            name: "Cash",
                            amount: 50000,
                            description: "Cash in wallet, jeans etc",
                        },
                        {
                            name: "BOB",
                            amount: 800000,
                            description: "Bank Of Barodra Lucknow",
                        },
                        {
                            name: "USFB",
                            amount: 16000,
                            description: "Utkarsh Small Finance Bank",
                        },
                    ],
                },
                categories: {
                    create: [
                        {
                            name: "Groceries",
                            description: "Groceries and foods",
                        },
                        {
                            name: "Entertainment",
                            description: "Movies and tv and others",
                        },
                        {
                            name: "Bank",
                            description: "Bank related transaction and charges",
                        },
                    ],
                },
            },
            include: {
                wallets: true,
                categories: true,
            },
        });
        const transaction = yield prisma.transaction.createMany({
            data: [
                {
                    name: "Pizza Party",
                    userId: user.id,
                    walletId: user.wallets[0].id,
                    description: "3 pizza party",
                    amount: 464,
                    type: "DEBIT",
                    categoryIds: [user.categories[0].id, user.categories[1].id],
                },
                {
                    name: "Savings + EMI",
                    userId: user.id,
                    walletId: user.wallets[2].id,
                    type: "CREDIT",
                    description: "Emi payment and saving from bo,b",
                    amount: 20000,
                    categoryIds: [user.categories[2].id],
                },
                {
                    name: "Savings + EMI transfer",
                    userId: user.id,
                    walletId: user.wallets[1].id,
                    type: "DEBIT",
                    description: "Emi payment and saving from bo,b",
                    amount: 20000,
                    categoryIds: [user.categories[2].id],
                },
                {
                    name: "Salary",
                    userId: user.id,
                    walletId: user.wallets[2].id,
                    type: "CREDIT",
                    description: "SDE Salary",
                    amount: 500000,
                },
            ],
        });
        const users = yield prisma.user.findMany({
            include: {
                wallets: true,
                categories: true,
                transactions: true,
            },
        });
        console.log("\x1b[32m", JSON.stringify(users, null, 2), "\x1b[0m");
    });
}
console.warn("\x1b[33mThis Process will \x1b[31mdelete every documents\x1b[33m inside all collection of gullak database.");
readline.question("\x1b[31mAre You Sure? [YES/NO] \x1b[0m", (ans) => {
    if (ans !== "YES") {
        console.log("Exiting the program Doing Nothing!");
    }
    else {
        main()
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.$disconnect();
        }))
            .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
            console.error(e);
            yield prisma.$disconnect();
            process.exit(1);
        }))
            .finally(() => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.$disconnect();
        }));
    }
    readline.close();
});
