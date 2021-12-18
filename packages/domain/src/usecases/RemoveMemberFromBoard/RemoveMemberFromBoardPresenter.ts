import { RemoveMemberFromBoardResponse } from './RemoveMemberFromBoardResponse';

export interface RemoveMemberFromBoardPresenter {
  present: (response: RemoveMemberFromBoardResponse) => void;
}
