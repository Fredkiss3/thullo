import { Document, Model } from "mongoose";
import { Board, BoardId, Member, MemberId } from "@thullo/domain";

export type MemberDocument = Document & Member & { uuid: MemberId };
export type BoardModel = Model<Board & { uuid: BoardId }>;

export type BoardDocument = Document &
  Omit<Board, 'participants'> & {
  uuid: BoardId;
  participants: Array<{
    isAdmin: boolean;
    member: MemberDocument;
  }>;
};
export type MemberModel = Model<Member & { uuid: MemberId }>;

declare global  {
  interface ProxyConstructor {
    new <TSource extends object, TTarget extends object>(target: TSource, handler: ProxyHandler<TSource>): TTarget;
  }
}