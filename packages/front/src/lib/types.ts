export type ApiErrors =
    | ({
          [key: string]: [string];
      } & { global?: [string] })
    | null;

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type Color =
    | 'GREEN'
    | 'YELLOW'
    | 'ORANGE'
    | 'RED'
    | 'BLUE'
    | 'LIGHTBLUE'
    | 'LIGHTGREEN'
    | 'BLACK'
    | 'PURPLE'
    | 'DARK'
    | 'GREY'
    | 'LIGHTGREY';

export type ToastMessage = {
    type: ToastType;
    message: string;
    duration?: number;
    keep?: boolean;
    closeable?: boolean;
};

export type ToastContextData = {
    [key: string]: ToastMessage;
} | null;

export interface ApiResult<T> {
    data: T;
    errors: ApiErrors;
}

export type User = {
    id: string;
    login: string;
    name: string;
    email: string;
    avatarURL: string;
};

export type BoardMember = {
    id: string;
    name: string;
    login: string;
    avatarURL: string | null;
};

export type Board = {
    id?: string;
    name: string;
    cover: {
        url: string;
    };
    participants: BoardMember[];
};

// this type serve for setting up some properties of an existing type optional
export type PartialOmit<T, K extends keyof T> = Omit<T, K> & Partial<T>;

export type Label = { id: string; name: string; color: Color };

export type Card = {
    id?: string;
    title: string;
    coverURL?: string | null;

    labels: PartialOmit<Label, 'id'>[];
    commentCount: number;
    attachmentCount: number;
};

export type DraggableCardData = {
    card: Card;
    index: number;
    listId: string;
};

export type DragHistory = {
    cardId: string;
    srcListId: string;
    oldPosition: number;

    destListId?: string;
    newPosition?: number;
};

export type CardWithId = Omit<Card, 'id'> & { id: string };

export type List = {
    id?: string;
    name: string;
    position: number;
    cards: Card[];
};

export type ListWithId = Omit<List, 'id'> & { id: string };

export type BoardDetails = {
    id: string;
    name: string;
    description: string | null;
    participants: BoardMember[];
    isPrivate: boolean;
    admin: BoardMember;
    lists: List[];
    labels: Label[];
};

export type CategorizedBoards = { self: Board[]; public: Board[] };

export type Photo = {
    id: string;
    thumbnailURL: string;
    smallURL: string;
    regularURL: string;
    authorUserName: string;
    authorName: string;
};

export type Comment = {
    id: string;
    date: Date;
    content: string;
    author: {
        name: string;
        id: string;
        avatarURL: string;
    };
};

export type Attachment = {
    id: string;
    url: string;
    date: Date;
    name: string;
};

export type CardDetails = {
    id: string;
    title: string;
    description: string | null;
    labels: PartialOmit<Label, 'id'>[];
    attachments: Attachment[];
    comments: Comment[];
    coverURL: string | null;
    parentListId: string;
};
