import { MemberId } from '../../entities/Member';

export interface DeleteListRequest {
    listId: string;
    boardId: string;
    requestedBy: MemberId;
}
