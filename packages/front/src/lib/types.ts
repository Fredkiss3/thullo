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
    login: string;
    name: string;
    email: string;
    avatarURL: string;
};

export type Board = {
    id: string;
    name: string;
    cover: {
        url: string;
        authorName: string;
        authorUserName: string;
    };
    participants: Array<{
        name: string;
        avatarURL: string | null;
    }>;
};

export type AddBoardRequest = {
    name: string;
    coverPhotoId: string;
    private: boolean;
}