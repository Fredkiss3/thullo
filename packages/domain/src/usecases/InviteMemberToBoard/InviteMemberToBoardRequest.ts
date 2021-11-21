import { BoardId } from "../../entities/Board";
import { MemberId } from "../../entities/Member";

export interface InviteMemberToBoardRequest {
  boardId: BoardId;
  memberId: MemberId;
}
