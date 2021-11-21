import { BoardId } from "../../entities/Board";
import { MemberId } from "../../entities/Member";

export interface SeeBoardDetailsRequest {
  boardId: BoardId;
  requesterId: MemberId;
}
