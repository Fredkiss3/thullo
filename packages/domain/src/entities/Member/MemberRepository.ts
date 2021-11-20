import { Member, SearchMembersResult } from './Member';
import { BoardId } from '../Board';

export interface MemberRepository {
    getMemberByLogin(login: string): Promise<Member | null>;
    searchMembersNotInBoard(
        loginOrName: string,
        boardId: BoardId
    ): Promise<SearchMembersResult[]>;
    getMemberById(id: string): Promise<Member | null>;
    register(member: Member): Promise<void>;
}
