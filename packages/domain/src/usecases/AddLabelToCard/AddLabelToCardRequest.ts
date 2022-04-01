import { BoardId } from './../../entities/Board';
import { MemberId } from './../../entities/Member';
import { CardId } from './../../entities/Card';
import { ColorType, LabelId } from './../../entities/Label';

export interface AddLabelToCardRequest {
    cardId: CardId;
    boardId: BoardId;
    requestedBy: MemberId;
    color?: ColorType | null;
    name?: string | null;
    labelId?: LabelId | null;
}
