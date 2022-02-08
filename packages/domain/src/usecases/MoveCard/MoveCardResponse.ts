import { FieldErrors } from '../../lib/types';

export class MoveCardResponse {
  constructor(public errors: FieldErrors) {}
}
