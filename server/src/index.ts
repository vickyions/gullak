import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import usersRouter from "./routes/users";

dotenv.config();

if (!process.env.PRIVATE_TOKEN) {
  console.log("\x1b[31mNO \x1b[35mPRIVATE_TOKEN\x1b[31m EXIST- \x1b[33mEXITING\x1b[0m");
  process.exit(1);
}

const PORT = parseInt(process.env.PORT || "3000", 10);
const app = express();

app.use(morgan("combined"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.send("<h1>Gullak Server responding</h1>");
});

app.use('/users', usersRouter);

app.listen(PORT, () => {
  console.log("\x1b[32mListening on Port: \x1b[33m", PORT, "\x1b[0m");
});