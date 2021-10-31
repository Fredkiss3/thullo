import { RegisterResponse } from './RegisterResponse';

export interface RegisterPresenter {
  present: (response: RegisterResponse) => void;
}
