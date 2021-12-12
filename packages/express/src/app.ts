import config from './config';
config();

import cors from 'cors';
import express from 'express';
import 'reflect-metadata';

import { boardRouter } from './routes/board';
import { memberRouter } from './routes/member';
import { authRouter } from './routes/auth';
import cp from 'cookie-parser';

const app = express();

// Cors to support cross-origin requests from browser
// JSON to support JSON requests and send JSON responses
const corsWhitelist = [
    'http://localhost:3000',
    process.env.ALLOWED_URLS?.split(',')
];

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests made from browser following the whitelist above
            // And allow requests made from REST clients
            if (corsWhitelist.indexOf(`${origin ?? ''}`) !== -1 || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
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
