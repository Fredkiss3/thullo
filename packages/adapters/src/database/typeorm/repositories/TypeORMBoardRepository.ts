import {
    Board,
    BoardAggregate,
    BoardAggregateRepository,
    BoardRepository
} from '@thullo/domain';
import { EntityRepository, MongoRepository } from 'typeorm';
import { BoardEntity } from '../entities/Board';

@EntityRepository(BoardEntity)
export class TypeORMBoardRepository
    extends MongoRepository<BoardEntity>
    implements BoardRepository, BoardAggregateRepository
{
    async saveAggregate(board: BoardAggregate): Promise<BoardAggregate> {
        const boardEntity = BoardEntity.fromAggregate(board);
        await this.save(boardEntity);
        return boardEntity.toAggregate();
    }

    async getBoardAggregateById(
        boardId: string
    ): Promise<BoardAggregate | null> {
        const board = await this.findOne({ uuid: boardId });
        return board ? board.toAggregate() : null;
    }

    async getAllPublicBoards(): Promise<Board[]> {
        const boards = await this.find({
            where: {
                private: false
            }
        });

        return boards.map(board => board.toDomain());
    }

    async getBoardById(id: string): Promise<Board | null> {
        const entity = await this.findOne({ uuid: id });
        return entity ? entity.toDomain() : null;
    }

    async addBoard(board: Board): Promise<Board> {
        const boardEntity = BoardEntity.fromDomain(board);
        await this.save(boardEntity);
        return boardEntity.toDomain();
    }

    async getAllBoardsWhereMemberIsPresentOrWherePublic(
        memberId: string
    ): Promise<Board[]> {
        const boards = await this.find({
            where: {
                $or: [
                    {
                        'participants.member.uuid': memberId
                    },
                    {
                        private: false
                    }
                ]
            }
        });

        return Promise.resolve(boards.map(board => board.toDomain()));
    }
}
