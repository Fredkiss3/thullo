import { FieldErrors } from '../../lib/types';

export class UpdateBoardDescriptionResponse {
  constructor(public errors: FieldErrors) {}
}
