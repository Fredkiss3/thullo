import { FieldErrors } from '../../utils/types';

export class RegisterResponse {
  constructor(public errors: FieldErrors) {}
}
