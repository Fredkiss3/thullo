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
