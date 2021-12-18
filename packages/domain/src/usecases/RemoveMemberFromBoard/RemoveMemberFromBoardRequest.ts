import { MemberId } from "../../entities/Member";
import { BoardId } from "../../entities/Board";

export interface RemoveMemberFromBoardRequest {
  boardId: BoardId;
  memberId: MemberId;
  initiatorId: MemberId;
}
