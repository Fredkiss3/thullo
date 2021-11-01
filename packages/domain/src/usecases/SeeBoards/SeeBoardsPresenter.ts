import { SeeBoardsResponse } from './SeeBoardsResponse';

export interface SeeBoardsPresenter {
  present: (response: SeeBoardsResponse) => void;
}
