import { FieldErrors } from '../../lib/types';
import { Member } from "../../entities/Member";


export class SearchMembersResponse {
    constructor(public members: Member[], public errors: FieldErrors) {}
}
