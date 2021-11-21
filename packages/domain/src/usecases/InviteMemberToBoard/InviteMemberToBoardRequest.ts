import { BoardId } from "../../entities/Board";
import { MemberId } from "../../entities/Member";

export interface InviteMemberToBoardRequest {
  requesterId: MemberId;
  boardId: BoardId;
  memberId: MemberId;
}
