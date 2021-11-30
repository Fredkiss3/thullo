import app from '../src/app';

app.listen(process.env.PORT, () =>
    console.log(`@thullo/api is running on running on Dev on port ${process.env.PORT}`)
);