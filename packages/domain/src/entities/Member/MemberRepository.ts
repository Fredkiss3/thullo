import { BoardId } from '../Board';
import { Member, MemberId } from './Member';

export interface MemberRepository {
    getMembersByEmail(email: string): Promise<Member | null>;
    searchMembersNotInBoard(
        loginOrName: string,
        boardId: BoardId
    ): Promise<Member[]>;
    getMemberById(id: MemberId): Promise<Member | null>;
    getMembersByIds(ids: MemberId[]): Promise<Member[]>;
    register(member: Member): Promise<void>;
}
