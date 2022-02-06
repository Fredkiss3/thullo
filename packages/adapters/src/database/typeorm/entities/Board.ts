import { Board, Participation } from '@thullo/domain';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
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

    @Column()
    coverURL?: string;

    // TODO
    // @Column(type => UnsplashMetadataEntity)
    // unsplashMetadata?: UnsplashMetadataEntity;

    @Column({
        nullable: true
    })
    description?: string | null;

    @Column()
    private?: boolean;

    @Column(type => ParticipationEntity)
    participants?: ParticipationEntity[] = [];

    toDomain(): Board {
        return {
            id: this.uuid!,
            name: this.name!,
            coverURL:
                this.coverURL ??
                `https://picsum.photos/seed/${this.uuid!}/800/800`,
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

        // TODO: Load metadata from unsplash
        // boardEntity.coverURL = board.coverURL;
        boardEntity.description = board.description;
        boardEntity.private = board.private;
        boardEntity.participants = board.participants.map(participant =>
            ParticipationEntity.fromDomain(participant)
        );
        return boardEntity;
    }
}
