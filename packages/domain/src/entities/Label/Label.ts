export const Colors = {
    GREEN: 'GREEN',
    YELLOW: 'YELLOW',
    ORANGE: 'ORANGE',
    RED: 'RED',
    BLUE: 'BLUE',
    LIGHTBLUE: 'LIGHTBLUE',
    LIGHTGREEN: 'LIGHTGREEN',
    BLACK: 'BLACK',
    PURPLE: 'PURPLE',
    DARK: 'DARK',
    GREY: 'GREY',
    LIGHTGREY: 'LIGHTGREY'
} as const;

export type ColorType = typeof Colors[keyof typeof Colors];

export type LabelId = string;
export interface Label {
    id: LabelId;
    name: string;
    color: ColorType;
    parentBoardId: string;
}
