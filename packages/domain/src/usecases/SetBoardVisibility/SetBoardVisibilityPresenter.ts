import { SetBoardVisibilityResponse } from './SetBoardVisibilityResponse';

export interface SetBoardVisibilityPresenter {
  present: (response: SetBoardVisibilityResponse) => void;
}
