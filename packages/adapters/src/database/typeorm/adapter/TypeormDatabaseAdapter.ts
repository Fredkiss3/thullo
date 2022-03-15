import { container, singleton } from 'tsyringe';
import { Connection, createConnection } from 'typeorm';
import { Database } from '../../database';
import { BoardEntity, ParticipationEntity } from '../entities/Board';
import { MemberEntity } from '../entities/Member';

@singleton()
export class TypeormDatabaseAdapter implements Database {
    private _connection: Connection | null = null;

    constructor(private uri: string) {
        this.connect();
    }

    async connect(): Promise<void> {
        if (this._connection) {
            return;
        }

        this._connection = await createConnection({
            type: 'mongodb',
            url: this.uri,
            useNewUrlParser: true,
            entities: [BoardEntity, MemberEntity, ParticipationEntity]
        });

        return;
    }

    disconnect(): Promise<void> {
        if (!this._connection) {
            return Promise.resolve();
        }
        return Promise.resolve(undefined);
    }
}

container.register(TypeormDatabaseAdapter, {
    useValue: new TypeormDatabaseAdapter(process.env.MONGO_URI!)
});
