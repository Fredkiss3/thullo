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
