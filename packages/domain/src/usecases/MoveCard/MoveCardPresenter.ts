import { MoveCardResponse } from './MoveCardResponse';

export interface MoveCardPresenter {
  present: (response: MoveCardResponse) => void;
}
