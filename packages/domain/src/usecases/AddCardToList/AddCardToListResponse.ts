import { FieldErrors } from '../../utils/types';

export class AddCardToListResponse {
  constructor(public errors: FieldErrors) {}
}
