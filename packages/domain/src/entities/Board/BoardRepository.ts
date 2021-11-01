import { Board } from './';

export interface BoardRepository {
    // getBoardById(id: string): Promise<Board | null>;
    getAllBoardsWhereMemberIsPresentOrIsOwner(memberId: string): Promise<Board[]>;
}
