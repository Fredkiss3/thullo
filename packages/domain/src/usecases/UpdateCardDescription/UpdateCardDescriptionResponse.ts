import { FieldErrors } from '../../lib/types';

export class UpdateCardDescriptionResponse {
  constructor(public errors: FieldErrors) {}
}
