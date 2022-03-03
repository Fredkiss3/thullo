import { MemberId } from '../../entities/Member';
import { BoardId } from '../../entities/Board';

export interface InviteMemberToBoardRequest {
  memberIds: MemberId[];
  initiatorId: MemberId;
  boardId: BoardId;
}
