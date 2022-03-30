import { SeeCardDetailsResponse } from './SeeCardDetailsResponse';

export interface SeeCardDetailsPresenter {
  present: (response: SeeCardDetailsResponse) => void;
}
