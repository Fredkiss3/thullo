import { Participation } from "../Participation";

export type BoardId = string;

export interface Board {
    id: BoardId;
    coverURL: string;
    name: string;
    participants: Participation[];
    description: string | null;
    private: boolean;
}
