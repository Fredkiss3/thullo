import { Member } from './Member';

export interface MemberRepository {
    getMemberByLogin(login: string): Promise<Member | null>;
    getAll(): Promise<Member[]>;
    register(member: Member): Promise<void>;
}
