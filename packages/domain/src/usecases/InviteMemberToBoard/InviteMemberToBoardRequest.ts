import { MemberId } from '../../entities/Member';
import { BoardId } from '../../entities/Board';

export interface InviteMemberToBoardRequest {
  memberId: MemberId;
  initiatorId: MemberId;
  boardId: BoardId;
}
