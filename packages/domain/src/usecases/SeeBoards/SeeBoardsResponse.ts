import { FieldErrors } from '../../utils/types';
import { Board } from '../../entities/Board';

export class SeeBoardsResponse {
    // TODO: Response args
    constructor(public boards: Board[] | null, public errors: FieldErrors) {}
}
