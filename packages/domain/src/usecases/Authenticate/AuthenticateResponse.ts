import { FieldErrors } from '../../utils/types';
import { Member } from "../../entities/Member";

export class AuthenticateResponse {
    constructor(public member: Member | null, public errors: FieldErrors) {}
}
