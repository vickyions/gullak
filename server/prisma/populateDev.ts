// populate operations handle here
// run npx ts-node %

import { PrismaClient } from "@prisma/client";
import { createInterface } from "readline";
const prisma = new PrismaClient({ log: ["query", "error", "info", "warn"] });

const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function main() {
    // clear Everything
    await prisma.transaction.deleteMany();
    await prisma.category.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
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
    const transaction = await prisma.transaction.createMany({
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
    const users = await prisma.user.findMany({
        include: {
            wallets: true,
            categories: true,
            transactions: true,
        },
    });
    console.log("\x1b[32m", JSON.stringify(users, null, 2), "\x1b[0m");
}

console.warn(
    "\x1b[33mThis Process will \x1b[31mdelete every documents\x1b[33m inside all collection of gullak database."
);
readline.question("\x1b[31mAre You Sure? [YES/NO] \x1b[0m", (ans) => {
    if (ans !== "YES") {
        console.log("Exiting the program Doing Nothing!");
    } else {
        main()
            .then(async () => {
                await prisma.$disconnect();
            })
            .catch(async (e) => {
                console.error(e);
                await prisma.$disconnect();
                process.exit(1);
            })
            .finally(async () => {
                await prisma.$disconnect();
            });
    }
    readline.close();
});
