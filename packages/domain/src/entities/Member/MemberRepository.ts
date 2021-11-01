import { Member } from './Member';

export interface MemberRepository {
    getMemberByLogin(login: string): Promise<Member | null>;
    getMemberById(id: string): Promise<Member | null>;
    register(member: Member): Promise<void>;
}
