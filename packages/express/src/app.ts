import config from './config';
config();

import cors from 'cors';
import express from 'express';
import 'reflect-metadata';

import { boardRouter } from './routes/board';
import { memberRouter } from './routes/member';
import { authRouter } from './routes/auth';

const app = express();

// Cors to support cross-origin requests from browser
// JSON to support JSON requests and send JSON responses
app.use(cors());
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
