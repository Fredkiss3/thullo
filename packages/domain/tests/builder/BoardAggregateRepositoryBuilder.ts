import {
    BoardAggregate,
    BoardAggregateRepository,
    BoardId
} from '@thullo/domain';

export class BoardAggregateRepositoryBuilder {
    private getBoardAggregateById: (
        id: BoardId
    ) => Promise<BoardAggregate | null> = () => Promise.resolve(null);

    private save: (aggregate: BoardAggregate) => Promise<BoardAggregate> =
        (aggregate: BoardAggregate) => Promise.resolve(aggregate);

    withGetBoardAggregateById(
        getBoardAggregateById: (id: BoardId) => Promise<BoardAggregate | null>
    ): BoardAggregateRepositoryBuilder {
        this.getBoardAggregateById = getBoardAggregateById;
        return this;
    }

    withSave(
        save: (aggregate: BoardAggregate) => Promise<BoardAggregate>
    ): BoardAggregateRepositoryBuilder {
        this.save = save;
        return this;
    }

    build(): BoardAggregateRepository {
        return {
            getBoardAggregateById: this.getBoardAggregateById,
            save: this.save
        };
    }
}
