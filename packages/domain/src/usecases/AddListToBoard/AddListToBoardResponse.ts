import { FieldErrors } from '../../lib/types';
import { List } from "../../entities/List";

export class AddListToBoardResponse {
  constructor(public list: List | null, public errors: FieldErrors) {}
}
