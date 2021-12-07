import { Column, ObjectID, ObjectIdColumn } from 'typeorm';

export abstract class BaseEntity<T> {
    @ObjectIdColumn()
    id?: ObjectID;

    @Column({
        type: 'text',
        unique: true
    })
    uuid?: string;

    abstract toDomain(): T;
}
