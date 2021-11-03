import { BoardAggregate } from './';
import { CommentRepository } from '../Comment';
import { BoardId } from '@thullo/domain';

export class BoardAggregateRepository {
    constructor(private commentRepository: CommentRepository) {}

    getBoardAggregateById(boardId: BoardId): BoardAggregate | null {
        return null;
    }

    save(board: BoardAggregate): void {}
}
