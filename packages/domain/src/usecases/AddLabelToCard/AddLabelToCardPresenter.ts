import { AddLabelToCardResponse } from './AddLabelToCardResponse';

export interface AddLabelToCardPresenter {
  present: (response: AddLabelToCardResponse) => void;
}
