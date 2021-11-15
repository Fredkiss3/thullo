import { AddCardToListResponse } from './AddCardToListResponse';

export interface AddCardToListPresenter {
  present: (response: AddCardToListResponse) => void;
}
