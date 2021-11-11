import { FieldErrors } from '../../utils/types';
import { BoardAggregate } from '../../entities/BoardAggregate';

export class SeeBoardDetailsResponse {
    constructor(
        public aggregate: BoardAggregate | null,
        public errors: FieldErrors
    ) {}
}
