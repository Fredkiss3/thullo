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

const app = express();

// All this configuration is for logging
const addRequestId = requesterId({
    setHeader: false,
});

app.use(addRequestId);

morgan.token('id', (req: Request & { id: string }) => req.id.split('-')[0]);

app.use(
    morgan('[:date[iso] #:id] Started :method :url for :remote-addr', {
        immediate: true,
    })
);

app.use(
    morgan(
        '[:date[iso] #:id] Completed :status :res[content-length] in :response-time ms'
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
app.use('/api/boards', boardRouter);
app.use('/api/auth', authRouter);
app.use('/api/members', memberRouter);
app.get('/api/ping', (req, res) => {
    return res.json({
        message: 'pong',
    });
});

export default app;
