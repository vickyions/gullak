import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (_req, res) => {
    res.send("<h1>Gullak Server responding</h1>")
})

app.listen(PORT, () => {
    console.log("\x1b[32mListening on Port: \x1b[33m", PORT, "\x1b[0m");
})
