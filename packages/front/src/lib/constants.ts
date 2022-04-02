import type { Color } from './types';
export const USER_QUERY = 'user';
export const USER_TOKEN = 'token';
export const BOARD_QUERY = 'boards';
export const SINGLE_BOARD_QUERY = 'board';
export const SINGLE_CARD_QUERY = 'card';

export const TAG_COLORS: Record<
    Lowercase<Color>,
    {
        bg: string;
        fg: string;
    }
> = {
    green: {
        bg: '#D3EADD',
        fg: '#219653',
    },
    blue: {
        bg: '#D5E6FB',
        fg: '#2F80ED',
    },
    yellow: {
        bg: '#FCF4DB',
        fg: '#F2C94C',
    },
    orange: {
        bg: '#FBE6D2',
        fg: '#F2994A',
    },
    purple: {
        bg: '#EBDCF9',
        fg: '#9B51E0',
    },
    red: {
        bg: '#FBEAEA',
        fg: '#EB5757',
    },
    lightblue: {
        fg: '#56CCF2',
        bg: '#ddf4fc',
    },
    lightgreen: {
        fg: '#6FCF97',
        bg: '#E3F9E5',
    },
    black: {
        fg: '#333333',
        bg: '#E0E0E0',
    },
    dark: {
        fg: '#4F4F4F',
        bg: '#F8F8F8',
    },
    grey: {
        fg: '#828282',
        bg: '#F8F8F8',
    },
    lightgrey: {
        fg: '#BDBDBD',
        bg: '#F8F8F8',
    },
};
