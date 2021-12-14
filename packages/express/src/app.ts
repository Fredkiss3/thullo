import cp from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import 'reflect-metadata';
import config from './config';
import { authRouter } from './routes/auth';
import { boardRouter } from './routes/board';
import { memberRouter } from './routes/member';
config();

const app = express();

// Cors to support cross-origin requests from browser
// JSON to support JSON requests and send JSON responses
app.use(
    cors({
        origin: '*',
        credentials: true, //access-control-allow-credentials:true
        optionsSuccessStatus: 200,
    })
);
app.use(cp());
app.use(express.json());
/* =================================================== */
/* ====================== ROUTES ===================== */
/* =================================================== */
app.use('/api/boards', boardRouter);
app.use('/api/auth', authRouter);
app.use('/api/members', memberRouter);
app.get('/api/ping', (req, res) => {
    return res.json({
        message: 'pong',
    });
});

export default app;
