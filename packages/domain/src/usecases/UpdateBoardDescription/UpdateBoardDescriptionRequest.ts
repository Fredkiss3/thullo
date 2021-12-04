import { MemberId } from './../../entities/Member/Member';
export interface UpdateBoardDescriptionRequest {
    initiatorId: MemberId;
    boardId: string;
    description: string | null;
}
