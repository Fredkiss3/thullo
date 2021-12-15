import type { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

export const handler: Handler = async (event, context) => {
    const res = await fetch('http://localhost:3031/api/auth/get-cookie');
    return {
        statusCode: 200,
        body: JSON.stringify(await res.json()),
    };
    // const hour = 3600000;
    // const twoWeeks = 14 * 24 * hour;
    // const myCookie = cookie.serialize('my_cookie', 'lolHi', {
    //     secure: true,
    //     httpOnly: true,
    //     path: '/',
    //     maxAge: twoWeeks,
    // });
    // return {
    //     statusCode: 200,
    //     headers: {
    //         'Set-Cookie': myCookie,
    //     },
    //     body: JSON.stringify({ message: 'Cookie set' }),
    // };
};
