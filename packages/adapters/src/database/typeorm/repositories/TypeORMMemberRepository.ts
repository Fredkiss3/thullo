import { BoardId, Member, MemberId, MemberRepository } from '@thullo/domain';
import { container } from 'tsyringe';
import { EntityRepository, MongoRepository } from "typeorm";
import { TypeORMBoardRepository } from '.';
import { MemberEntity } from '../entities/Member';

@EntityRepository(MemberEntity)
export class TypeORMMemberRepository
    extends MongoRepository<MemberEntity>
    implements MemberRepository
{
    async getMembersByEmail(email: string): Promise<Member | null> {
        const entity = await this.findOne({ email });
        return entity ? entity.toDomain() : null;
    }

    async getMemberById(uuid: MemberId): Promise<Member | null> {
        const entity = await this.findOne({ uuid });
        return entity ? entity.toDomain() : null;
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
                        // search by login or name case insensitive
                        $or: [
                            { login: { $regex: loginOrName, $options: 'i' } },
                            { name: { $regex: loginOrName, $options: 'i' } }
                        ]
                    },
                    {
                        // Exclude board members
                        uuid: {
                            $nin: board.participants.map(
                                ({ member }) => member.id
                            )
                        }
                    }
                ]
            },
            // Order by login alphabetically
            order: {
                login: 'ASC'
            }
        });

        return members.map(m => m.toDomain());
    }

    async getMembersByIds(ids: MemberId[]): Promise<Member[]> {
        const members = await this.find({
            where: {
                uuid: {
                    $in: ids
                }
            }
        });

        return members.map(m => m.toDomain());
    }
}
