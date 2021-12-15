import type { Handler } from '@netlify/functions';
import cookie from 'cookie';
import fetch from 'node-fetch';
import { ApiResult } from '../lib/types';

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    let authCode = '';

    try {
        const data = JSON.parse(event.body!);
        authCode = data.authCode;
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                data: null,
                errors: {
                    authCode: [
                        "Une erreur est survenue, veuillez recommencer l'opération",
                    ],
                },
            }),
        };
    }

    // Use environment
    console.log('NODE_ENV =>', process.env.NODE_ENV);

    const url =
        process.env.NODE_ENV != 'production'
            ? 'http://localhost:3031'
            : `${process.env.API_URL}`;

    const res = (await fetch(`${url}/api/auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authCode,
        }),
    }).then((res) => res.json())) as ApiResult<Record<string, string>>;

    const headers = {} as Record<string, string>;
    if (res.errors == null) {
        const hour = 3600000;
        const twoWeeks = 14 * 24 * hour;
        const myCookie = cookie.serialize('token', res.data.token, {
            secure: true,
            httpOnly: true,
            path: '/',
            maxAge: twoWeeks,
        });

        // set cookie if no errors
        headers['Set-Cookie'] = myCookie;
    }

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            data: { success: res.errors == null },
            errors: res.errors,
        }),
    };
};
