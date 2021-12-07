import { Member, MemberId } from "./Member";
import { BoardId } from '../Board';

export interface MemberRepository {
    getMembersByLogin(login: string): Promise<Member[]>;
    getMemberByIdToken(idToken: string): Promise<Member | null>;
    searchMembersNotInBoard(
        loginOrName: string,
        boardId: BoardId
    ): Promise<Member[]>;
    getMemberById(id: MemberId): Promise<Member | null>;
    register(member: Member): Promise<void>;
}
