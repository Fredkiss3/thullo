import { MemberId } from "../Member";

export interface Board {
  id: string;
  cover: string;
  name: string;
  description: string | null;
  private: boolean;
  ownerId: MemberId;
}