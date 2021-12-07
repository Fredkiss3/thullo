import { Board, BoardId } from "./";

export interface BoardRepository {
    addBoard(board: Board): Promise<Board>;
    getBoardById(id: BoardId): Promise<Board | null>;
    getAllBoardsWhereMemberIsPresent(
        memberId: string
    ): Promise<Board[]>;
}
