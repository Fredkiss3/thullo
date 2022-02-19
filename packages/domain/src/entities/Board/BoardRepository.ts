import { Board, BoardId } from './';

export interface BoardRepository {
    addBoard(board: Board): Promise<Board>;
    getBoardById(id: BoardId): Promise<Board | null>;
    getAllBoardsWhereMemberIsPresentOrWherePublic(
        memberId: string
    ): Promise<Board[]>;
    getAllPublicBoards(): Promise<Board[]>;
}
