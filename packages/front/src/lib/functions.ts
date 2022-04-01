// @ts-ignore
import { Remarkable } from 'remarkable';
// @ts-ignore
import { linkify } from 'remarkable/linkify';

import { USER_TOKEN } from './constants';

import type { Collision } from '@dnd-kit/core';
import type {
    ApiErrors,
    ApiResult,
    Board,
    CategorizedBoards,
    ToastType,
    User,
    ListWithId,
} from './types';

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

/**
 * Set a cookie with the given name and value for the given number of days.
 *
 * @example
 *      setCookie('name', 'value', 1);
 *      // => "name=value; expires=86400"
 * @param name
 * @param value
 * @param days
 */
export function setCookie(name: string, value: string, days: number = 7): void {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
}

/**
 * Get the value of a cookie with the given name.
 * @example
 *      getCookie('name');
 *      // => "value"
 * @param name
 * @returns
 */
export function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() ?? null;
    }

    return null;
}

/**
 *  Remove a cookie with the given name.
 * @param name
 */
export function deleteCookie(name: string): void {
    // Delete the cookie by setting the expiration date in the past
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Get the initials of a user name.
 * @example
 *      getInitials('John Doe');
 *      // => "JD"
 * @param name
 * @returns
 */
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
 * Change APIErrors Format to toast format
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

/**
 * Generate an array of numbers from start to the end
 *
 * @example
 *      range(1, 5);
 *      // => [1, 2, 3, 4]
 * @param start
 * @param end
 * @returns
 */
export function range(start: number, end: number): number[] {
    return Array.from({ length: end - start }, (_, i) => i + start);
}

/**
 * Render markdown to html
 * @param markdown
 * @returns
 */
export function renderMarkdown(markdown: string): string {
    return new Remarkable('full', {
        html: true,
        breaks: true,
        typographer: true,
    })
        .use(linkify)
        .render(markdown);
}

/**
 * Concatenate the specified classNames automatically with spaces.
 *  - If the className is undefined, it is ignored.
 *  - If the className is passed as a record of {class: condition }, it returns the class only if the condition is true.
 *
 * @example
 *      clsx('class1', 'class2', { class: true }) // 'class1 class2 class'
 *      clsx('class1', 'class2', { class: false }) // 'class1 class2'
 *      clsx('class1', undefined) // 'class1'
 *
 * @param args
 * @returns
 */
export function clsx(
    ...args: (string | undefined | Record<string, boolean>)[]
): string {
    const classes: string[] = [];

    for (const arg of args) {
        switch (typeof arg) {
            case 'string':
                classes.push(arg);
                break;
            case 'object':
                for (const key in arg) {
                    if (arg[key]) {
                        classes.push(key);
                    }
                }
                break;
        }
    }

    return classes.join(' ');
}

/**
 * transform array of elements with id property to a record of id : element
 *
 * @example
 *   const elements = [{id: 1}, {id: 2}];
 *   const record = arrayToRecord(elements); // record = {1: {id: 1}, 2: {id: 2}}
 */
export function arrayToRecord<T extends { id?: string }>(
    array: T[]
): Record<string, T> {
    return array.reduce((acc, cur, index) => {
        const id = cur['id'];
        if (id) {
            acc[id] = cur;
        } else {
            acc[index] = cur;
        }
        return acc;
    }, {} as Record<string, T>);
}

export type MoveCardArgs = {
    srcList: ListWithId;
    destList: ListWithId;
    srcIndex: number;
    destIndex: number;
};

/**
 * Move card from one list to another
 *
 * @example
 *      const list1 = {id: 1, cards: [{id: 1}, {id: 2}]};
 *      const list2 = {id: 2, cards: [{id: 3}, {id: 4}]};
 *
 *      moveCardBetweenLists({
 *          srcList: list1,
 *          destList: list2,
 *          srcIndex: 0,
 *          destIndex: 0})
 *
 *      // list1 = {id: 1, cards: [{id: 2}]}
 *      // list2 = {id: 2, cards: [{id: 1}, {id: 3}, {id: 4}]}
 *
 * @returns
 */
export function moveCardBetweenLists({
    srcList,
    destList,
    srcIndex,
    destIndex,
}: MoveCardArgs): { srcList: ListWithId; destList: ListWithId } {
    // remove card from src list
    const cardToMove = srcList!.cards!.splice(srcIndex, 1)[0];

    // insert card in dest list at position
    destList!.cards.splice(destIndex, 0, {
        ...cardToMove,
    });

    return { srcList, destList };
}

/**
 * Deepcopy an object
 * @param obj
 */
export function deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * get the max element of an array
 * @param array
 * @param key
 */
export function getMax<T>(array: T[], key: keyof T): T | undefined {
    return array.length === 0
        ? undefined
        : array.reduce((acc, cur) => {
              return acc[key] > cur[key] ? acc : cur;
          });
}

/**
 * to find the nearest collision, We have to go through each element in order:
 *     - if the element is a droppable, continue
 *     - if the element is the same as the active element, continue
 *     - else we stop and return the element
 */
export function getNextCollision(
    collisions: Collision[] | null,
    overId: string,
    activeId: string,
    droppableIds: Record<string, any>
): Collision | null {
    let collisionFound: Collision | null = null;

    if (collisions !== null) {
        for (const collision of collisions) {
            if (
                collision.id !== overId &&
                collision.id !== activeId &&
                !(overId in droppableIds)
            ) {
                collisionFound = collision;
                break;
            }
        }
    }

    return collisionFound;
}
