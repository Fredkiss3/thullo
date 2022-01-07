import { CardId } from "../../entities/Card";
import { ListId } from "../../entities/List";
import { BoardId } from "../../entities/Board";
import { MemberId } from "../../entities/Member";

export interface MoveCardRequest {
  boardId: BoardId;
  cardId: CardId;
  destinationListId: ListId;
  destinationPosition: number;
  requestedBy: MemberId;
}
