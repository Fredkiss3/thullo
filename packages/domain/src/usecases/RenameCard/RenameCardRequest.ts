import { BoardId } from '../../entities/Board';
import { CardId } from '../../entities/Card';
import { MemberId } from '../../entities/Member';

export interface RenameCardRequest {
    boardId: BoardId;
    requestedBy: MemberId;
    cardId: CardId;
    title: string;
}
