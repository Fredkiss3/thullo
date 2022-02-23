import { CardEntity } from './Card';
import {
    Board,
    Participation,
    BoardAggregate,
    BoardAggregateBuilder
} from '@thullo/domain';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { ListEntity } from './List';
import { MemberEntity } from './Member';
import { UnsplashMetadataEntity } from './UnsplashMetadata';

@Entity('participants')
export class ParticipationEntity {
    @ObjectIdColumn()
    id?: ObjectID;

    @Column()
    isAdmin?: boolean;

    @Column(type => MemberEntity)
    member?: MemberEntity;

    toDomain(): Participation {
        return {
            isAdmin: this.isAdmin!,
            member: this.member!.toDomain()
        };
    }

    static fromDomain(participation: Participation): ParticipationEntity {
        const participationEntity = new ParticipationEntity();
        participationEntity.isAdmin = participation.isAdmin;
        participationEntity.member = MemberEntity.fromDomain(
            participation.member
        );
        return participationEntity;
    }
}

@Entity('boards')
export class BoardEntity extends BaseEntity<Board> {
    @Column()
    name?: string;

    @Column(_ => UnsplashMetadataEntity)
    cover?: UnsplashMetadataEntity;

    @Column({
        nullable: true
    })
    description?: string | null;

    @Column()
    private?: boolean;

    @Column(_ => ParticipationEntity)
    participants: ParticipationEntity[] = [];

    @Column(_ => ListEntity)
    lists: ListEntity[] = [];

    @Column(_ => CardEntity)
    cards: CardEntity[] = [];

    toAggregate(): BoardAggregate {
        return new BoardAggregateBuilder()
            .withBoardId(this.uuid!)
            .withName(this.name!)
            .withDescription(this.description!)
            .withIsPrivate(this.private!)
            .withCards(this.cards.map(card => card.toDomain()))
            .withLists(this.lists.map(list => list.toDomain()))
            .withParticipants(
                this.participants.map(participant => participant.toDomain())
            )
            .build();
    }

    static fromAggregate(aggregate: BoardAggregate): BoardEntity {
        const boardEntity = new BoardEntity();
        boardEntity.uuid = aggregate.boardId;
        boardEntity.name = aggregate.name;
        boardEntity.description = aggregate.description;
        boardEntity.private = aggregate.isPrivate;

        boardEntity.participants = aggregate.participants.map(
            ParticipationEntity.fromDomain
        );

        boardEntity.lists = Object.values(aggregate.listsByIds).map(
            ListEntity.fromDomain
        );

        boardEntity.cards = Object.values(aggregate.cardsByLists).reduce(
            (prev, next) => {
                return [...prev, ...next.map(CardEntity.fromDomain)];
            },
            [] as CardEntity[]
        );
        return boardEntity;
    }

    toDomain(): Board {
        return {
            id: this.uuid!,
            name: this.name!,
            cover: this.cover!.toDomain(),
            description: this.description!,
            private: this.private!,
            participants: this.participants!.map(participant =>
                participant.toDomain()
            )
        };
    }

    static fromDomain(board: Board): BoardEntity {
        const boardEntity = new BoardEntity();
        boardEntity.uuid = board.id;
        boardEntity.name = board.name;

        boardEntity.cover = UnsplashMetadataEntity.fromDomain(board.cover);
        boardEntity.description = board.description;
        boardEntity.private = board.private;
        boardEntity.participants = board.participants.map(participant =>
            ParticipationEntity.fromDomain(participant)
        );
        return boardEntity;
    }
}
