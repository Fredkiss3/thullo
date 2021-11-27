import { FieldErrors } from '../../lib/types';
import { Member } from '../../entities/Member';

export class AuthenticateWithOauthResponse {
    constructor(public member: Member | null, public errors: FieldErrors) {}
}
