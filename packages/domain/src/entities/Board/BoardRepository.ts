import { Board } from './';

export interface BoardRepository {
    addBoard(board: Board): Promise<void>;
    getAllBoardsWhereMemberIsPresentOrIsOwner(
        memberId: string
    ): Promise<Board[]>;
}
