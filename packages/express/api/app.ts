import express, { Express } from 'express';
import cors from 'cors';

const app: Express = express();

// Cors to support cross-origin requests from browser
// JSON to support JSON requests and send JSON responses
app.use(cors());
app.use(express.json());

app.get('/api', (_, res) => {
    res.send({
        success: `@thullo/api is up and running on port ${process.env.PORT} in environment '${process.env.NODE_ENV}'`,
    });
});

app.get('/api/ping', (_, res) => {
    res.send({
        success: 'pong',
    });
});

export default app;
