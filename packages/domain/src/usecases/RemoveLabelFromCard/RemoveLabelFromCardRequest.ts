import { BoardId } from './../../entities/Board';
import { MemberId } from './../../entities/Member';
import { CardId } from './../../entities/Card';
import { LabelId } from './../../entities/Label';

export interface RemoveLabelFromCardRequest {
    cardId: CardId;
    boardId: BoardId;
    requestedBy: MemberId;
    labelId: LabelId;
}
