export type MemberId = string;

export interface Member {
    id: MemberId;
    name: string;
    login: string;
    email?: string;
    avatarURL: string | null;
    // Not needed for now
    idToken?: string;
}
