import { FieldErrors } from '../../utils/types';
import { Board } from '../../entities/Board';

export class AddBoardResponse {
    constructor(public board: Board | null, public errors: FieldErrors) {}
}
