import { Board, BoardRepository } from '@thullo/domain';

export class BoardRepositoryBuilder {
    private getAllBoardsWhereMemberIsPresentOrIsOwner: (
        memberId: string
    ) => Promise<Board[]> = () => Promise.resolve([]);

    withGetAllBoardsWhereMemberIsPresentOrIsOwner(
        getAllBoardsWhereMemberIsPresentOrIsOwner: (memberId: string) => Promise<Board[]>
    ) {
        this.getAllBoardsWhereMemberIsPresentOrIsOwner =
            getAllBoardsWhereMemberIsPresentOrIsOwner;
        return this;
    }

    build(): BoardRepository {
        return {
            // getBoardById(id: string): Promise<Board | null> {
            //     return Promise.resolve(null);
            // },
            getAllBoardsWhereMemberIsPresentOrIsOwner:
                this.getAllBoardsWhereMemberIsPresentOrIsOwner
        };
    }
}
