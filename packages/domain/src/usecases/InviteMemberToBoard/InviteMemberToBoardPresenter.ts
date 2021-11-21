import { InviteMemberToBoardResponse } from './InviteMemberToBoardResponse';

export interface InviteMemberToBoardPresenter {
  present: (response: InviteMemberToBoardResponse) => void;
}
