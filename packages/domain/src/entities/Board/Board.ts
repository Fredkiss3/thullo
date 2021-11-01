import { Member } from "../Member";

export interface Board {
  id: string;
  cover: string;
  name: string;
  description: string | null;
  participants: Member[];
  private: boolean;
  owner: Member;
}