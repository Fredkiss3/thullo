import { OAuthResult, UserInfo } from "./types";

export interface OAuthGateway {
  getUserInfo(accessToken: string, idToken: string): Promise<UserInfo | null>;
  getAccessToken(authCode: string): Promise<OAuthResult | null>;
}