import { UpdateBoardDescriptionResponse } from './UpdateBoardDescriptionResponse';

export interface UpdateBoardDescriptionPresenter {
  present: (response: UpdateBoardDescriptionResponse) => void;
}
