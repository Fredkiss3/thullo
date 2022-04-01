import { FieldErrors } from '../../lib/types';

export class UpdateCardCoverResponse {
  constructor(public errors: FieldErrors) {}
}
