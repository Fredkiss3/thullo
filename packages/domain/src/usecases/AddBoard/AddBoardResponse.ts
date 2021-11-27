import { FieldErrors } from '../../lib/types';
import { Board } from '../../entities/Board';

export class AddBoardResponse {
    constructor(public board: Board | null, public errors: FieldErrors) {}
}
