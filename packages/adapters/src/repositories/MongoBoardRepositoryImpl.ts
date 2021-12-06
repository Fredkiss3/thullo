import { AbstractMongoRepository } from './AbstractMongoRepository';
import { Board, BoardId, BoardRepository, MemberId } from '@thullo/domain';
import { Database } from '../database';
import { container, injectable } from 'tsyringe';
import { Document, model, Schema } from 'mongoose';
import { MemberDocument } from './MongoMemberRepositoryImpl';

export type BoardDocument = Document &
    Omit<Board, 'participants'> & {
        uuid: BoardId;
        participants: Array<{
            isAdmin: boolean;
            member: MemberDocument;
        }>;
    };

@injectable()
export class MongoBoardRepositoryImpl
    extends AbstractMongoRepository<Board>
    implements BoardRepository
{
    constructor(private database: Database) {
        super();
    }

    async init(): Promise<void> {
        await this.database.connect();

        this.schema = new Schema({
            name: {
                type: String,
                required: true
            },
            uuid: {
                type: String,
                unique: true,
                required: true
            },
            coverURL: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: false
            },
            private: {
                type: Boolean,
                required: true
            },
            participants: [
                {
                    isAdmin: { type: Boolean, required: true, default: false },
                    member: { type: Schema.Types.ObjectId, ref: 'Member' }
                }
            ]
        });

        this.model = model('Board', this.schema);
    }

    static toDomain(doc: BoardDocument): Board {
        return {
            id: doc.uuid,
            name: doc.name,
            coverURL: doc.coverURL,
            description: doc.description,
            private: doc.private,
            participants: doc.participants.map(({ isAdmin, member }) => ({
                isAdmin: isAdmin,
                member: {
                    id: member.uuid,
                    name: member.name,
                    login: member.login,
                    avatarURL: member.avatarURL,
                    idToken: member.idToken
                }
            }))
        };
    }

    async addBoard(board: Board): Promise<Board> {
        await this.model!.create({
            ...board,
            uuid: board.id
        });

        return board;
    }

    getAllBoardsWhereMemberIsPresent(memberId: MemberId): Promise<Board[]> {
        return Promise.resolve([]);
    }
}

// Register the repository in the container
container.register('BoardRepository', {
    useFactory: async () => {
        const instance = container.resolve(MongoBoardRepositoryImpl);
        await instance.init();
        return instance;
    }
});
