import config from './config';
config();
import cp from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import 'reflect-metadata';
import { authRouter } from './routes/auth';
import { boardRouter } from './routes/board';
import { memberRouter } from './routes/member';
import requesterId from 'express-request-id';
import morgan from 'morgan';
import type { Request } from 'express';
import { unsplashRouter } from './routes/unsplash';

const app = express();

// All this configuration is for logging
const addRequestId = requesterId({
    setHeader: false,
});

app.use(addRequestId);

morgan.token('id', (req: Request & { id: string }) => req.id.split('-')[0]);

app.use(
    morgan(
        '[:date[iso] #:id] Started \x1b[33m :method\x1b[0m \x1b[34m:url\x1b[0m for :remote-addr',
        {
            immediate: true,
        }
    )
);

app.use(
    morgan(
        '[:date[iso] #:id] Completed in \x1b[36m:response-time ms\x1b[0m with status \x1b[32m:status\x1b[0m'
    )
);

// Cors to support cross-origin requests from browser
// JSON to support JSON requests and send JSON responses
app.use(
    cors({
        origin: process.env.OAUTH_REDIRECT_URI,
        credentials: true, //access-control-allow-credentials:true
        optionsSuccessStatus: 200,
    })
);
app.use(cp());
app.use(express.json());
/* =================================================== */
/* ====================== ROUTES ===================== */
/* =================================================== */
app.use('/api/proxy/unsplash', unsplashRouter);
app.use('/api/boards', boardRouter);
app.use('/api/auth', authRouter);
app.use('/api/members', memberRouter);
app.get('/api/ping', (req, res) => {
    return res.json({
        message: 'pong',
    });
});

export default app;
