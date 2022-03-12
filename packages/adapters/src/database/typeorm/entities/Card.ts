import { UnsplashMetadataEntity } from './UnsplashMetadata';
import { Card } from '@thullo/domain';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity('cards')
export class CardEntity extends BaseEntity<Card> {
    @Column()
    title?: string;

    @Column()
    description?: string;

    @Column()
    parentListId?: string;

    @Column()
    position?: number;

    @Column({
        type: 'json',
        nullable: true
    })
    cover?: UnsplashMetadataEntity;

    static fromDomain(card: Card): CardEntity {
        const cardEntity = new CardEntity();
        cardEntity.uuid = card.id;
        cardEntity.title = card.title;
        cardEntity.description = card.description;
        cardEntity.parentListId = card.parentListId;
        cardEntity.position = card.position;
        cardEntity.cover = card.cover
            ? UnsplashMetadataEntity.fromDomain(card.cover)
            : undefined;
        return cardEntity;
    }

    toDomain(): Card {
        return {
            id: this.uuid!,
            title: this.title!,
            description: this.description!,
            parentListId: this.parentListId!,
            position: this.position!,
            cover: this.cover ? this.cover.toDomain() : null,
            // TODO: implement the rest of the properties
            attachments: [],
            labels: [],
            comments: []
        };
    }

    // TODO : Add the rest of the properties
}
