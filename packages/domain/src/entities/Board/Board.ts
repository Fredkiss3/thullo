import { Member, MemberId } from "../Member";

export type BoardId = string;

export interface Board {
    id: BoardId;
    coverURL: string;
    name: string;
    participants: Member[];
    description: string | null;
    private: boolean;
    ownerId: MemberId;
}
