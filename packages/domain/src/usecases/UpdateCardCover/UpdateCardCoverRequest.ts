import { MemberId } from '../../entities/Member';
import { CardId } from '../../entities/Card';
import { BoardId } from '../../entities/Board';

export interface UpdateCardCoverRequest {
  coverPhotoId?: string;
  requestedBy: MemberId;
  cardId: CardId;
  boardId: BoardId;
}
