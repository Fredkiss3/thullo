import { ChangeBoardNameResponse } from './ChangeBoardNameResponse';

export interface ChangeBoardNamePresenter {
  present: (response: ChangeBoardNameResponse) => void;
}
