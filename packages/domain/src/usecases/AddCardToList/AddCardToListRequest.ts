import { MemberId } from "../../entities/Member";
import { ListId } from "../../entities/List";
import { BoardId } from "../../entities/Board";

export interface AddCardToListRequest {
  requesterId: MemberId;
  title: string;
  listId: ListId;
  boardId: BoardId;
}
