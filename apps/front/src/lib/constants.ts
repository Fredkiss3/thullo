import type { Color } from './types';
export const USER_QUERY = 'user';
export const USER_TOKEN = 'token';
export const BOARD_QUERY = 'boards';
export const SINGLE_BOARD_QUERY = 'board';
export const SINGLE_CARD_QUERY = 'card';

export const TAG_COLORS: Record<
    Color,
    {
        bg: string;
        fg: string;
    }
> = {
    GREEN: {
        bg: '#D3EADD',
        fg: '#219653',
    },
    BLUE: {
        bg: '#D5E6FB',
        fg: '#2F80ED',
    },
    YELLOW: {
        bg: '#FCF4DB',
        fg: '#F2C94C',
    },
    ORANGE: {
        bg: '#FBE6D2',
        fg: '#F2994A',
    },
    PURPLE: {
        bg: '#EBDCF9',
        fg: '#9B51E0',
    },
    RED: {
        bg: '#FBEAEA',
        fg: '#EB5757',
    },
    LIGHTBLUE: {
        fg: '#56CCF2',
        bg: '#ddf4fc',
    },
    LIGHTGREEN: {
        fg: '#6FCF97',
        bg: '#E3F9E5',
    },
    BLACK: {
        fg: '#333333',
        bg: '#E0E0E0',
    },
    DARK: {
        fg: '#4F4F4F',
        bg: '#F8F8F8',
    },
    GREY: {
        fg: '#828282',
        bg: '#F8F8F8',
    },
    LIGHTGREY: {
        fg: '#BDBDBD',
        bg: '#F8F8F8',
    },
};
