import { AddListToBoardResponse } from './AddListToBoardResponse';

export interface AddListToBoardPresenter {
  present: (response: AddListToBoardResponse) => void;
}
