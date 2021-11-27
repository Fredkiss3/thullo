import { FieldErrors } from '../../lib/types';
import { SearchMembersResult } from "../../entities/Member";


export class SearchMembersResponse {
    constructor(public members: SearchMembersResult[], public errors: FieldErrors) {}
}
