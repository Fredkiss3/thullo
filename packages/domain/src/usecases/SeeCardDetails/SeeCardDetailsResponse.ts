import { FieldErrors } from '../../lib/types';
import { Card } from '../../entities/Card';

export class SeeCardDetailsResponse {
    constructor(public card: Card | null, public errors: FieldErrors) {}
}
