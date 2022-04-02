import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { Label, ColorType } from '@thullo/domain';
import { BaseEntity } from './BaseEntity';

@Entity('label')
export class LabelEntity extends BaseEntity<Label> {
    @ObjectIdColumn()
    id?: ObjectID;

    @Column()
    color?: string;

    @Column()
    name?: string;

    @Column()
    boardId?: string;

    toDomain(): Label {
        return {
            id: this.uuid!,
            name: this.name!,
            color: this.color as ColorType,
            parentBoardId: this.boardId!
        };
    }

    static fromDomain(label: Label): LabelEntity {
        const entity = new LabelEntity();
        entity.uuid = label.id;
        entity.name = label.name;
        entity.color = label.color;
        entity.boardId = label.parentBoardId;
        return entity;
    }
}
