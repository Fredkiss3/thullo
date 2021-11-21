import { BoardId } from "../../entities/Board";
import { MemberId } from "../../entities/Member";

export interface ChangeBoardNameRequest {
  boardId: BoardId;
  requesterId: MemberId;
  name: string;
}
