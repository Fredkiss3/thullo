import { Board, BoardRepository } from '@thullo/domain';
import { EntityRepository, MongoRepository } from 'typeorm';
import { BoardEntity } from '../entities/Board';

@EntityRepository(BoardEntity)
export class TypeORMBoardRepository
    extends MongoRepository<BoardEntity>
    implements BoardRepository
{
    async getBoardById(id: string): Promise<Board | null> {
        const entity = await this.findOne({ uuid: id });
        return entity ? entity.toDomain() : null;
    }

    async addBoard(board: Board): Promise<Board> {
        const boardEntity = BoardEntity.fromDomain(board);
        await this.save(boardEntity);
        return boardEntity.toDomain();
    }

    async getAllBoardsWhereMemberIsPresent(memberId: string): Promise<Board[]> {
        const boards = await this.find({
            where: {
                'participants.member.uuid': memberId
            }
        });

        return Promise.resolve(boards.map(board => board.toDomain()));
    }
}
