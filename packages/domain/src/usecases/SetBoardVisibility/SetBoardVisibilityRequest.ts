import { MemberId } from "../../entities/Member";
import { BoardId } from "../../entities/Board";

export interface SetBoardVisibilityRequest {
  private: boolean;
  boardId: BoardId;
  requesterId: MemberId;
}
