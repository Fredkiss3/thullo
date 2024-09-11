import app from '../src/app';

app.listen(process.env.PORT, () =>
    console.log(`@thullo/api is running on ${process.env.NODE_ENV} on port ${process.env.PORT}`)
);