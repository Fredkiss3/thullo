import { List } from '@thullo/domain';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity('lists')
export class ListEntity extends BaseEntity<List> {
    @Column()
    name?: string;

    @Column('int')
    position?: number;

    @Column()
    boardId?: string;

    static fromDomain(list: List): ListEntity {
        const listEntity = new ListEntity();
        listEntity.name = list.name;
        listEntity.position = list.position;
        listEntity.boardId = list.boardId;
        listEntity.uuid = list.id;
        return listEntity;
    }

    toDomain(): List {
        return {
            id: this.uuid!,
            name: this.name!,
            position: this.position!,
            boardId: this.boardId!
        };
    }
}
