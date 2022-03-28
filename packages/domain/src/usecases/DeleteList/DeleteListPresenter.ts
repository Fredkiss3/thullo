import { DeleteListResponse } from './DeleteListResponse';

export interface DeleteListPresenter {
  present: (response: DeleteListResponse) => void;
}
