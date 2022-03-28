import { RenameListResponse } from './RenameListResponse';

export interface RenameListPresenter {
  present: (response: RenameListResponse) => void;
}
