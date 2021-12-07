import { BoardId, Member, MemberId, MemberRepository } from '@thullo/domain';
import { container, inject, injectable } from 'tsyringe';
import { BoardModel, MemberDocument, MemberModel } from '../lib/types';
import { MongooseDatabaseAdapter } from "../adapter/MongooseDatabaseAdapter";

@injectable()
export class MongooseMemberRepository implements MemberRepository {
    constructor(
        private database: MongooseDatabaseAdapter,
        @inject('MemberModel') private model: MemberModel
    ) {}

    async init(): Promise<void> {
        await this.database.connect();
    }

    static toDomain(doc: MemberDocument): Member {
        return {
            id: doc.uuid,
            name: doc.name,
            login: doc.login,
            avatarURL: doc.avatarURL,
            idToken: doc.idToken
        };
    }

    async getMemberById(id: MemberId): Promise<Member | null> {
        const doc = await this.model.findOne({ uuid: id });
        return doc ? MongooseMemberRepository.toDomain(doc) : null;
    }

    async getMembersByLogin(login: string): Promise<Member[]> {
        const docs = await this.model.find({ login });
        return docs.map(MongooseMemberRepository.toDomain);
    }

    async register(member: Member): Promise<void> {
        await this.model.create({
            ...member,
            uuid: member.id
        });

        return;
    }

    async searchMembersNotInBoard(
        loginOrName: string,
        boardId: BoardId
    ): Promise<Member[]> {
        const boardModel: BoardModel = container.resolve('BoardModel');

        const q = boardModel.find({
            uuid: boardId
        });

        return [];

        // const members: MemberDocument[] = await this.model!.find({
        //     $and: [
        //         {
        //             $or: [
        //                 { login: { $regex: loginOrName, $options: 'i' } },
        //                 { name: { $regex: loginOrName, $options: 'i' } }
        //             ]
        //         },
        //         { uuid: { $nin: board } }
        //     ]
        // });

        // boards.map((board) => {
        //     console.dir(board.participants, { depth: 4 });
        // });
        // const docs = await this.model!.find({
        //     $and: [
        //         {
        //             $or: [
        //                 { login: { $regex: loginOrName, $options: 'i' } },
        //                 { name: { $regex: loginOrName, $options: 'i' } }
        //             ]
        //         },
        //         {
        //             uuid: {
        //                 // participants is shape of [{ isAdmin: boolean, member: { ref: ObjectId } }]
        //                 $nin: await boardModel.distinct(
        //                     'participants.member.uuid',
        //                     {
        //                         uuid: boardId
        //                     }
        //                 )
        //             }
        //         }
        //     ]
        // });

        // return members.map(MongoMemberRepositoryImpl.toDomain);
    }

    async getMemberByIdToken(idToken: string): Promise<Member | null> {
        const doc = await this.model!.findOne({ idToken });
        return doc ? MongooseMemberRepository.toDomain(doc) : null;
    }
}
