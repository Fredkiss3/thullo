import { BoardId, Member, MemberId, MemberRepository } from '@thullo/domain';
import { container } from 'tsyringe';
import { EntityRepository, MongoRepository } from 'typeorm';
import { TypeORMBoardRepository } from '.';
import { MemberEntity } from '../entities/Member';

@EntityRepository(MemberEntity)
export class TypeORMMemberRepository
    extends MongoRepository<MemberEntity>
    implements MemberRepository
{
    async getMemberById(uuid: MemberId): Promise<Member | null> {
        const entity = await this.findOne({ uuid });
        return entity ? entity.toDomain() : null;
    }

    getMemberByIdToken(idToken: string): Promise<Member | null> {
        return Promise.resolve(null);
    }

    getMembersByLogin(login: string): Promise<Member[]> {
        return Promise.resolve([]);
    }

    async register(member: Member): Promise<void> {
        const entity = MemberEntity.fromDomain(member);
        await this.save(entity);

        return;
    }

    async searchMembersNotInBoard(
        loginOrName: string,
        boardId: BoardId
    ): Promise<Member[]> {
        const boardRepository: TypeORMBoardRepository = await container.resolve(
            'BoardRepository'
        );

        // retrieve the board
        const board = (await boardRepository.getBoardById(boardId))!;

        const members = await this.find({
            where: {
                $and: [
                    {
                        $or: [
                            { login: { $regex: `^${loginOrName}` } },
                            { name: { $regex: `^${loginOrName}` } }
                        ]
                    },
                    {
                        uuid: {
                            $nin: board.participants.map(
                                ({ member }) => member.id
                            )
                        }
                    }
                ]
            },
            order: {
                login: 1
            }
        });

        return members.map(m => m.toDomain());
    }
}
