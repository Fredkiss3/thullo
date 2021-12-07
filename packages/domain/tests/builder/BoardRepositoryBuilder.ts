import { Board, BoardRepository } from '@thullo/domain';

export class BoardRepositoryBuilder {
    private getAllBoardsWhereMemberIsPresent: (
        memberId: string
    ) => Promise<Board[]> = () => Promise.resolve([]);

    private getBoardById: (id: string) => Promise<Board | null> = () => Promise.resolve(null);


    private addBoard: (board: Board) => Promise<Board> = (board: Board) =>
        Promise.resolve(board);

    withGetAllBoardsWhereMemberIsPresent(
        getAllBoardsWhereMemberIsPresent: (memberId: string) => Promise<Board[]>
    ) {
        this.getAllBoardsWhereMemberIsPresent =
            getAllBoardsWhereMemberIsPresent;
        return this;
    }

    withAddBoard(addBoard: (board: Board) => Promise<Board>) {
        this.addBoard = addBoard;
        return this;
    }

    withGetBoardById(getBoardById: (id: string) => Promise<Board | null>) {
        this.getBoardById = getBoardById;
        return this;
    }

    build(): BoardRepository {
        return {
            addBoard: this.addBoard,
            getAllBoardsWhereMemberIsPresent:
                this.getAllBoardsWhereMemberIsPresent,
            getBoardById: this.getBoardById,
        };
    }
}
