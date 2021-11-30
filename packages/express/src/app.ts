import config from './config';
config();

import express from 'express';
import type { Application } from 'express';
import cors from 'cors';

const app: Application = express();

// Cors to support cross-origin requests from browser
// JSON to support JSON requests and send JSON responses
app.use(cors());
app.use(express.json());

app.get('/api/ping', (req, res) => {
    return res.json({
        message: 'pong',
    });
});

app.get('/api', (_, res) => {
    res.send({
        success: `@thullo/api is up and running in environment '${process.env.NODE_ENV}'`,
    });
});

export default app;
