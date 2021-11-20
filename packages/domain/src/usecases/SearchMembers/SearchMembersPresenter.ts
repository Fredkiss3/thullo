import { SearchMembersResponse } from './SearchMembersResponse';

export interface SearchMembersPresenter {
  present: (response: SearchMembersResponse) => void;
}
