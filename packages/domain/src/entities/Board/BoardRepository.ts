import { Board } from './';

export interface BoardRepository {
    addBoard(board: Board): Promise<Board>;
    getAllBoardsWhereMemberIsPresentOrIsOwner(
        memberId: string
    ): Promise<Board[]>;
}
