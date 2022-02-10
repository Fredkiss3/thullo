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
    username: string;
    email: string;
    avatarURL: string;
};

export type Board = {
    id?: string;
    name: string;
    cover: {
        url: string;
    };
    participants: Array<{
        id: string;
        name: string;
        username: string;
        avatarURL: string | null;
    }>;
};

export type AddBoardRequest = {
    name: string;
    coverPhotoId: string;
    coverPhotoUrl: string;
    private: boolean;
};

export type CategorizedBoards = { self: Board[]; public: Board[] };
