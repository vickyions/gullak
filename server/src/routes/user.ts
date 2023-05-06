import { Router } from "express";
import { prisma } from "../prismaServer";
import { hash, compare } from "bcrypt";
import { body } from "express-validator";
const router = Router();
const SALT_ROUNDS: number = parseInt(process.env.SALT_ROUNDS || "10", 10);
const PRIVATE_TOKEN: string | undefined = process.env.PRIVATE_TOKEN;

router.post("/register", async (req, res) => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    const user = prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user)
      return res.status(409).json({
        error: "Email already exists",
        field: "email",
      });

    // create user
    const pHash = await hash(password, SALT_ROUNDS);
    console.log(pHash);
    return res.status(500);
  } catch {}
});

export default router;
