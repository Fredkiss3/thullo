import { AuthenticateWithOauthResponse } from './AuthenticateWithOauthResponse';

export interface AuthenticateWithOauthPresenter {
  present: (response: AuthenticateWithOauthResponse) => void;
}
