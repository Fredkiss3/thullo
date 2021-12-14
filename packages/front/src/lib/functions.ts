import { ApiResult } from './types';

export function parseQueryStringFromURL(url: string): {
    [key: string]: string;
} {
    const queryString = url.split('?')[1];
    const params = queryString?.split('&') ?? [];
    const query: { [key: string]: string } = {};

    for (const param of params) {
        const [key, value] = param.split('=');
        query[key] = value;
    }

    return query;
}

export function getHostWithScheme(url: string): string {
    const urlObject = new URL(url);
    return urlObject.protocol + '//' + urlObject.host;
}

export function wait(ms: number): Promise<void> {
    // Wait for the specified amount of time
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function jsonFetch<T>(
    url: string,
    options: RequestInit = {}
): Promise<ApiResult<T>> {
    const headers = {
        ...options.headers,
        'Content-Type': 'application/json',
    };

    // only wait in development mode
    if (import.meta.env.MODE === 'development') {
        await wait(2000);
    }

    return fetch(url, {
        ...options,
        headers,
        credentials: 'include',
        mode: 'cors',
    }).then((response) => response.json());
}
