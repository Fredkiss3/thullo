import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: `${__dirname}/config/.env.local` });
}

import app from './app';

app.listen(process.env.PORT, () =>
    console.log(`@thullo/api is running on PORT ${process.env.PORT} on Dev.`)
);