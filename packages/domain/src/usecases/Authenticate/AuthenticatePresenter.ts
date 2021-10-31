import { AuthenticateResponse } from './AuthenticateResponse';

export interface AuthenticatePresenter {
  present: (response: AuthenticateResponse) => void;
}
