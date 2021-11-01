import { Board, BoardRepository } from '@thullo/domain';

export class BoardRepositoryBuilder {
    private getAllBoardsWhereMemberIsPresentOrIsOwner: (
        memberId: string
    ) => Promise<Board[]> = () => Promise.resolve([]);

    private addBoard: (board: Board) => Promise<void> = (board: Board) =>
        Promise.resolve();

    withGetAllBoardsWhereMemberIsPresentOrIsOwner(
        getAllBoardsWhereMemberIsPresentOrIsOwner: (
            memberId: string
        ) => Promise<Board[]>
    ) {
        this.getAllBoardsWhereMemberIsPresentOrIsOwner =
            getAllBoardsWhereMemberIsPresentOrIsOwner;
        return this;
    }

    withAddBoard(addBoard: (board: Board) => Promise<void>) {
        this.addBoard = addBoard;
        return this;
    }

    build(): BoardRepository {
        return {
            addBoard: this.addBoard,
            getAllBoardsWhereMemberIsPresentOrIsOwner:
                this.getAllBoardsWhereMemberIsPresentOrIsOwner
        };
    }
}
