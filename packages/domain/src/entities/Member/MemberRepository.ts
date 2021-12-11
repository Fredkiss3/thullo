import { BoardId } from '../Board';
import { Member, MemberId } from './Member';

export interface MemberRepository {
    getMembersByLogin(login: string): Promise<Member[]>;
    getMembersByEmail(email: string): Promise<Member | null>;
    searchMembersNotInBoard(
        loginOrName: string,
        boardId: BoardId
    ): Promise<Member[]>;
    getMemberById(id: MemberId): Promise<Member | null>;
    register(member: Member): Promise<void>;
}
