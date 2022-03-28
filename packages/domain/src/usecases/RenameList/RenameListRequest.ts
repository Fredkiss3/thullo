import { MemberId } from '../../entities/Member';

export interface RenameListRequest {
    listId: string;
    boardId: string;
    newName: string;
    requestedBy: MemberId;
}
