import { FieldErrors } from '../../utils/types';
import { List } from "../../entities/List";

export class AddListToBoardResponse {
  constructor(public list: List | null, public errors: FieldErrors) {}
}
