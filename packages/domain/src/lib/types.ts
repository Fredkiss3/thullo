import { ValidationErrors } from 'validatorjs';

export type FieldErrors =
    | (ValidationErrors & {
          global?: [string];
      })
    | null;

export type UserInfo = {
    name: string;
    login: string;
    email: string;
    avatarURL: string;
};

export type OAuthResult = {
    accessToken: string;
    idToken: string;
};

// this type serve for setting up some properties of an existing type optional
export type PartialOmit<T, K extends keyof T> = Omit<T, K> & Partial<T>;
