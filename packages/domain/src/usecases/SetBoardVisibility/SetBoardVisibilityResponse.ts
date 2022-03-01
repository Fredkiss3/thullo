import { BoardAggregate } from './../../entities/BoardAggregate/BoardAggregate';
import { FieldErrors } from '../../lib/types';

export class SetBoardVisibilityResponse {
    constructor(
        public board: BoardAggregate | null,
        public errors: FieldErrors
    ) {}
}
