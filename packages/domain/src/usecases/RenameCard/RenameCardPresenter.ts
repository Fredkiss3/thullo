import { RenameCardResponse } from './RenameCardResponse';

export interface RenameCardPresenter {
  present: (response: RenameCardResponse) => void;
}
