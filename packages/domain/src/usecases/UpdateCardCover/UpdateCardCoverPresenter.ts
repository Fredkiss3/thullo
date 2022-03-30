import { UpdateCardCoverResponse } from './UpdateCardCoverResponse';

export interface UpdateCardCoverPresenter {
  present: (response: UpdateCardCoverResponse) => void;
}
