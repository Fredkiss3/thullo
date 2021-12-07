export type MemberId = string;

export interface Member {
    id: MemberId;
    name: string;
    login: string;
    idToken?: string;
    avatarURL: string | null;
}

