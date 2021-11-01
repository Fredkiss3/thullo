import { AddBoardResponse } from './AddBoardResponse';

export interface AddBoardPresenter {
  present: (response: AddBoardResponse) => void;
}
