import { MemberId } from "../../entities/Member";

export interface AddListToBoardRequest {
  requesterId: MemberId;
  boardId: string;
  name: string;
}
