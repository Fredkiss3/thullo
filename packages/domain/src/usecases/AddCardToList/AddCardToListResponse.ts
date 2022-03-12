import { Card } from '../../entities/Card';
import { FieldErrors } from '../../lib/types';

export class AddCardToListResponse {
    constructor(public card: Card | null, public errors: FieldErrors) {}
}
