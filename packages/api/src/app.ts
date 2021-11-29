import dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/config/.env.local` });

import express from 'express';
import cors from 'cors';

const app = express();

// Cors to support cross-origin requests from browser
// JSON to support JSON requests and send JSON responses
app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
    res.send({
        success: 'Hello from @thullo/api',
    });
});

app.listen(process.env.PORT, () =>
    console.log(`@thullo/api is running on PORT ${process.env.PORT} on Qovery ?`),
);
