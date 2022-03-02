import { FieldErrors } from '../../lib/types';
import { BoardAggregate } from '../../entities/BoardAggregate';

export class RemoveMemberFromBoardResponse {
    constructor(
        public aggregate: BoardAggregate | null,
        public errors: FieldErrors
    ) {}
}
