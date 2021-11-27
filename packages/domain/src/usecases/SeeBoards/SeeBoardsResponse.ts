import { FieldErrors } from '../../lib/types';
import { Board } from '../../entities/Board';

export class SeeBoardsResponse {
    // TODO: Response args
    constructor(public boards: Board[] | null, public errors: FieldErrors) {}
}
