export type JWTData = {
  login: string;
  name: string;
  email: string;
  avatarURL: string;
  exp: number;
  iat: number;
};

export type ApiErrors = {
  [key: string]: [string];
} | null;

export interface ApiResult<T> {
  data: T;
  errors: ApiErrors;
}
