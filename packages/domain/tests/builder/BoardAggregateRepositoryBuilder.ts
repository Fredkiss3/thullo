import {
    BoardAggregate,
    BoardAggregateRepository,
    BoardId
} from '@thullo/domain';

export class BoardAggregateRepositoryBuilder {
    private getBoardAggregateById: (
        id: BoardId
    ) => Promise<BoardAggregate | null> = () => Promise.resolve(null);

    private saveAggregate: (
        aggregate: BoardAggregate
    ) => Promise<BoardAggregate> = (aggregate: BoardAggregate) =>
        Promise.resolve(aggregate);

    withGetBoardAggregateById(
        getBoardAggregateById: (id: BoardId) => Promise<BoardAggregate | null>
    ): BoardAggregateRepositoryBuilder {
        this.getBoardAggregateById = getBoardAggregateById;
        return this;
    }

    withSaveAggregate(
        saveAggregate: (aggregate: BoardAggregate) => Promise<BoardAggregate>
    ): BoardAggregateRepositoryBuilder {
        this.saveAggregate = saveAggregate;
        return this;
    }

    build(): BoardAggregateRepository {
        return {
            getBoardAggregateById: this.getBoardAggregateById,
            saveAggregate: this.saveAggregate
        };
    }
}
