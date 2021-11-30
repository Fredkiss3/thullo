import dotenv from 'dotenv';

export default () => {
    if (process.env.NODE_ENV !== 'production') {
        dotenv.config({
            path: `${__dirname}/.env.local`,
        });
    }
};
