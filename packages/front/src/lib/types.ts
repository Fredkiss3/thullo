export type ApiErrors =
    | ({
          [key: string]: [string];
      } & { global?: [string] })
    | null;

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

export type Card = {
    id: string;
    title: string;
    coverURL: string | null;

    // TODO: add more fields
    // labels: [];
    // comments: [];
    // attachments: [];
};

export type List = {
    id: string;
    name: string;
    cards: Card[];
};

export type BoardDetails = {
    id: string;
    name: string;
    description: string | null;
    participants: BoardMember[];
    isPrivate: boolean;
    admin: BoardMember;
    lists: List[];
};

export type AddBoardRequest = {
    name: string;
    coverPhotoId: string;
    coverPhotoUrl: string;
    private: boolean;
};

export type CategorizedBoards = { self: Board[]; public: Board[] };

export type Photo = {
    id: string;
    thumbnailURL: string;
    smallURL: string;
    authorUserName: string;
    authorName: string;
};
