import { BoardId } from '../../entities/Board';
import { MemberId } from '../../entities/Member';
import { CardId } from '../../entities/Card';

export interface SeeCardDetailsRequest {
    boardId: BoardId;
    requestedBy: MemberId;
    cardId: CardId;
}
