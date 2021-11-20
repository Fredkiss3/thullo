import { FieldErrors } from '../../utils/types';
import { SearchMembersResult } from "../../entities/Member";


export class SearchMembersResponse {
    constructor(public members: SearchMembersResult[], public errors: FieldErrors) {}
}
