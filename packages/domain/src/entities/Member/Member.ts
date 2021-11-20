export type MemberId = string;

export interface Member {
    id: MemberId;
    name: string;
    login: string;
    password: string;
    avatarURL: string | null;
}

export type SearchMembersResult = Pick<Member, 'id' | 'name' | 'avatarURL'>;
