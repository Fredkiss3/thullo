import { UpdateCardDescriptionResponse } from './UpdateCardDescriptionResponse';

export interface UpdateCardDescriptionPresenter {
  present: (response: UpdateCardDescriptionResponse) => void;
}
