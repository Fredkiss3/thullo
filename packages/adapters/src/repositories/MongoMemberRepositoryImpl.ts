import { model, Schema, Document } from 'mongoose';
import {
    BoardId,
    Member,
    MemberId,
    MemberRepository,
    SearchMembersResult
} from '@thullo/domain';
import { AbstractMongoRepository } from './AbstractMongoRepository';
import { Database } from '../database';
import { container, injectable } from 'tsyringe';

export type MemberDocument = Document & Member & { uuid: MemberId };

@injectable()
export class MongoMemberRepositoryImpl
    extends AbstractMongoRepository<Member>
    implements MemberRepository
{
    constructor(public database: Database) {
        super();
    }

    async init(): Promise<void> {
        await this.database.connect();

        this.schema = new Schema({
            name: {
                type: String,
                required: true
            },
            login: {
                type: String,
                required: true
            },
            uuid: {
                type: String,
                required: true,
                unique: true
            },
            avatarURL: {
                type: String,
                required: false
            },
            idToken: {
                type: String,
                required: true,
                unique: true
            },
        });
        this.model = model('Member', this.schema);
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
        const doc = await this.model!.findOne({ uuid: id });
        return doc ? MongoMemberRepositoryImpl.toDomain(doc) : null;
    }

    async getMembersByLogin(login: string): Promise<Member[]> {
        const docs = await this.model!.find({ login });
        return docs.map(MongoMemberRepositoryImpl.toDomain);
    }

    async register(member: Member): Promise<void> {
        await this.model!.create({
            ...member,
            uuid: member.id
        });

        return;
    }

    async searchMembersNotInBoard(
        loginOrName: string,
        boardId: BoardId
    ): Promise<SearchMembersResult[]> {
        return [];
    }

    async getMemberByIdToken(idToken: string): Promise<Member | null> {
        const doc = await this.model!.findOne({ idToken });
        return doc ? MongoMemberRepositoryImpl.toDomain(doc) : null;
    }
}

// Register the repository in the container
container.register('MemberRepository', {
    useFactory: async () => {
        const instance = container.resolve(MongoMemberRepositoryImpl);
        await instance.init();
        return instance;
    }
});
