import { BoardId } from "../../entities/Board";

export interface SearchMembersRequest {
  query: string;
  boardId: BoardId;
  limit: number;
}
