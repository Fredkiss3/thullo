import { LabelEntity } from './Label';
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

    @Column(_ => LabelEntity)
    labels: LabelEntity[] = [];

    static fromDomain(card: Card, position: number): CardEntity {
        const cardEntity = new CardEntity();
        cardEntity.uuid = card.id;
        cardEntity.title = card.title;
        cardEntity.description = card.description;
        cardEntity.parentListId = card.parentListId;
        cardEntity.position = position;
        cardEntity.cover = card.cover
            ? UnsplashMetadataEntity.fromDomain(card.cover)
            : undefined;

        cardEntity.labels = card.labels.map(label =>
            LabelEntity.fromDomain(label)
        );
        return cardEntity;
    }

    toDomain(): Card {
        return {
            id: this.uuid!,
            title: this.title!,
            description: this.description!,
            parentListId: this.parentListId!,
            cover: this.cover
                ? UnsplashMetadataEntity.toDomain(this.cover)
                : null,
            labels: this.labels.map(label => label.toDomain()),
            // TODO: implement the rest of the properties
            attachments: [],
            comments: []
        };
    }

    // TODO : Add the rest of the properties
}
