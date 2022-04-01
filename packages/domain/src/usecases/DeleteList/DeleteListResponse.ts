import { FieldErrors } from '../../lib/types';

export class DeleteListResponse {
  constructor(public errors: FieldErrors) {}
}
