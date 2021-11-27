import { FieldErrors } from '../../lib/types';

export class AddCardToListResponse {
  constructor(public errors: FieldErrors) {}
}
