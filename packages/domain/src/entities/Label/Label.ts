export enum Colors {
    GREEN = 'GREEN',
    YELLOW = 'YELLOW',
    ORANGE = 'ORANGE',
    RED = 'RED',
    BLUE = 'BLUE',
    LIGHTBLUE = 'LIGHTBLUE',
    LIGHTGREEN = 'LIGHTGREEN',
    BLACK = 'BLACK',
    PURPLE = 'PURPLE',
    DARK = 'DARK',
    GREY = 'GREY',
    LIGHTGREY = 'LIGHTGREY',
    LIGHT = 'LIGHT'
}

export interface Label {
    id: string;
    name: string;
    color: Colors;
    parentBoardId: string;
}
