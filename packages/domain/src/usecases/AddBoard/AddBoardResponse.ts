import { FieldErrors } from '../../utils/types';

export class AddBoardResponse {
  constructor(public errors: FieldErrors) {}
}
