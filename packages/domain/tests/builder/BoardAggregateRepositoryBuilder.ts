import {
    BoardAggregate,
    BoardAggregateRepository,
    BoardId
} from '@thullo/domain';

export class BoardAggregateRepositoryBuilder {
    private getBoardAggregateById: (
        id: BoardId
    ) => Promise<BoardAggregate | null> = () => Promise.resolve(null);

    private saveBoardAggregate: (aggregate: BoardAggregate) => Promise<BoardAggregate> =
        (aggregate: BoardAggregate) => Promise.resolve(aggregate);

    withGetBoardAggregateById(
        getBoardAggregateById: (id: BoardId) => Promise<BoardAggregate | null>
    ): BoardAggregateRepositoryBuilder {
        this.getBoardAggregateById = getBoardAggregateById;
        return this;
    }

    withSaveBoardAggregate(
        saveBoardAggregate: (aggregate: BoardAggregate) => Promise<BoardAggregate>
    ): BoardAggregateRepositoryBuilder {
        this.saveBoardAggregate = saveBoardAggregate;
        return this;
    }

    build(): BoardAggregateRepository {
        return {
            getBoardAggregateById: this.getBoardAggregateById,
            saveBoardAggregate: this.saveBoardAggregate
        };
    }
}
