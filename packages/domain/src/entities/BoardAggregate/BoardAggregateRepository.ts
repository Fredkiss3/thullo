import { BoardAggregate } from './';
import { BoardId } from '../Board';

export interface BoardAggregateRepository {
    getBoardAggregateById(boardId: BoardId): Promise<BoardAggregate | null>;
    saveAggregate(board: BoardAggregate): Promise<BoardAggregate>;
}
