import { FieldErrors } from '../../lib/types';

export class RegisterResponse {
  constructor(public errors: FieldErrors) {}
}
