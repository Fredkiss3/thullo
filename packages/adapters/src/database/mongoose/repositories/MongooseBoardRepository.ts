import { Board, BoardRepository, MemberId } from '@thullo/domain';
import { container, injectable } from 'tsyringe';
import { MongooseDatabaseAdapter } from '../adapter/MongooseDatabaseAdapter';
import { BoardDocument, BoardModel, MemberModel } from '../lib/types';

@injectable()
export class MongooseBoardRepository implements BoardRepository {
    constructor(
        private database: MongooseDatabaseAdapter,
        private model: BoardModel
    ) {}
    getBoardById(id: string): Promise<Board | null> {
        throw new Error('Method not implemented.');
    }

    async init(): Promise<void> {
        await this.database.connect();
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
        const memberModel: MemberModel = container.resolve('MemberModel');

        await this.model.create({
            ...board,
            uuid: board.id,
            participants: [
                {
                    isAdmin: true,
                    member: await memberModel.findOne({
                        uuid: board.participants[0].member.id
                    })
                }
            ]
        });

        return board;
    }

    getAllBoardsWhereMemberIsPresent(memberId: MemberId): Promise<Board[]> {
        return Promise.resolve([]);
    }
}
