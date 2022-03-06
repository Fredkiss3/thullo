import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';

import { USER_TOKEN } from './constants';
import {
    ApiResult,
    Board,
    CategorizedBoards,
    User,
    ApiErrors,
    ToastType,
} from './types';

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
    // Set the default headers correctly
    const headers: HeadersInit = new Headers(options.headers);
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');

    const user_token = getCookie(USER_TOKEN);

    if (user_token) {
        headers.set('Authorization', `Bearer ${user_token}`);
    }

    // only wait in development mode
    if (import.meta.env.MODE === 'development') {
        await wait(1500);
    }

    return fetch(url, {
        ...options,
        headers,
        credentials: 'include',
    })
        .then((response) => response.json())
        .catch((error) => {
            console.error('There was an error ?', error);
        });
}

export function setCookie(name: string, value: string, days: number = 7): void {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
}

export function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() ?? null;
    }

    return null;
}

export function deleteCookie(name: string): void {
    // Delete the cookie by setting the expiration date in the past
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function getInitials(name: string): string {
    const words = name.split(' ');
    const initials = words.map((word) => word[0]).join('');
    return initials.slice(0, 2).toUpperCase();
}

/**
 * Separate boards between self and others
 */
export function categorizeBoards(
    boards: Board[],
    user: User
): CategorizedBoards {
    const self = boards.filter((board) =>
        board.participants.some((participant) => participant.id === user.id)
    );
    const others = boards.filter((board) => !self.includes(board));
    return { self, public: others };
}

/**
 *  Call the specified function with a delay
 */
export function debounce(callback: Function, delay: number = 500) {
    let timer: number | undefined;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = window.setTimeout(() => {
            // @ts-ignore
            callback.apply(this, args);
        }, delay);
    };
}

/**
 * Chnage APIErrors Format to toast format
 */
export function formatAPIError(errors: ApiErrors): {
    key: string;
    type: ToastType;
    message: string;
}[] {
    return !errors
        ? []
        : Object.entries(errors).map(([key, values]) => ({
              key,
              type: 'error',
              message: values.join(', '),
          }));
}

export function range(start: number, end: number): number[] {
    return Array.from({ length: end - start }, (_, i) => i + start);
}

export function renderMarkdown(markdown: string): string {
    const html = new Remarkable('full', {
        html: true,
        breaks: true,
        typographer: true,
    })
        .use(linkify)
        .render(markdown)
        .replace(/\n/g, '<br>');

    return html;
}
