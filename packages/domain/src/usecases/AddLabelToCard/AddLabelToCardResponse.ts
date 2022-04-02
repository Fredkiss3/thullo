import { Label } from '../../entities/Label';
import { FieldErrors } from '../../lib/types';

export class AddLabelToCardResponse {
    constructor(
        public label: Label | null,
        public errors: FieldErrors | null
    ) {}
}
