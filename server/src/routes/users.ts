import { Router } from "express";
import { prisma } from "../prismaServer";
import { hash, compare } from "bcrypt";
import { validationResult } from "express-validator";
import { sign, verify } from "jsonwebtoken";
import {
  emailValidator,
  nameValidator,
  passwordValidator,
  stringValidator,
} from "../utils/validators";
const router = Router();
const SALT_ROUNDS: number = parseInt(process.env.SALT_ROUNDS || "10", 10);
const PRIVATE_TOKEN = process.env.PRIVATE_TOKEN as string;

router.post(
  "/register",
  nameValidator("name", { max: 32, min: 2 }),
  emailValidator("email"),
  passwordValidator("password", { max: 64, min: 8 }),
  async (req, res) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.json({
          errors: result.array(),
        });
      }

      const {
        name,
        email,
        password,
      }: { name: string; email: string; password: string } = req.body;

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (user) {
        return res.status(409).json({
          error: "Email already exists",
        });
      }

      // create user
      const pHash = await hash(password, SALT_ROUNDS);
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: pHash,
          categories: {
            create: [
              {
                name: "unknown", // adding a default category
                description: "Don't know where to put these",
              },
            ],
          },
          wallets: {
            create: [
              {
                name: "cash", // adding a defualt wallet
                description: "Some good old green leafs",
              },
            ],
          },
        },
        select: {
          name: true,
          email: true,
          categories: {
            select: {
              name: true,
              description: true,
            },
          },
          wallets: {
            select: {
              name: true,
              description: true,
              amount: true,
            },
          },
        },
      });
      const accToken = sign({ email }, PRIVATE_TOKEN, {
        algorithm: "HS256",
        expiresIn: "5d",
      });

      res.cookie("access-token", accToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "dev",
        maxAge: 432000000, // 5days
      });
      res.status(201).json({
        message: "User successfully created",
        user: newUser,
      });
    } catch (err) {
      console.error(Date().toLocaleString(), err);
      res.status(500).json({
        message: "An error occured while registering the user",
      });
    }
  }
);

router.post(
  "/login",
  emailValidator("email"),
  stringValidator("password", { max: 64, min: 8 }),
  async (req, res) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.json({
          errors: result.array(),
        });
      }

      const { email, password }: { email: string; password: string } = req.body;
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(401).json({
          error: "Invalid credentials. Please try again",
        });
      }

      const isCorrectPass = await compare(password, user.password);

      if (!isCorrectPass) {
        return res.status(401).json({
          error: "Invalid credentials. Please try again",
        });
      }

      const accToken = sign({ email: user.email }, PRIVATE_TOKEN, {
        algorithm: "HS256",
        expiresIn: "5d",
      });

      res.cookie("access-token", accToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "dev",
        maxAge: 432000000, // 5days
      });
      res.status(201).json({
        message: "Successfully logged in",
      });
    } catch (err) {
      console.error(Date().toLocaleString(), err);
      res.status(500).json({
        message: "An error occured while registering the user",
      });
    }
  }
);

export default router;
