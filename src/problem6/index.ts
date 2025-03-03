import bodyParser from 'body-parser';
import express from 'express';
import Redis from 'ioredis';
import cors from 'cors';
import http from 'http';

import userScoreRouter from './Router/userScore';
import configRouter from './Router/config';
import userRouter from './Router/user';

import "./connect";

const app = express();
const PORT = process.env.PORT_PROBLEM6 || 3001;

const server = http.createServer(app);
const redisClient = new Redis();

app.use(cors());
app.use(bodyParser.json());
app.use("/v1", configRouter);
app.use("/v1", userRouter);
app.use("/v1", userScoreRouter);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});