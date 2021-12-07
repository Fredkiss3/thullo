import { connect, Connection, disconnect, connection } from 'mongoose';
import { container, singleton } from 'tsyringe';
import { Database } from '../../database';

@singleton()
export class MongooseDatabaseAdapter implements Database {
    private isConnected: boolean = false;
    private _connection: Connection | null = null;

    constructor(private uri: string) {}

    async connect(): Promise<void> {
        if (this.isConnected && this._connection) {
            return;
        }

        await connect(this.uri);
        this._connection = connection;
        this.isConnected = true;
    }

    get connection(): Connection | null {
        return this._connection;
    }

    async disconnect(): Promise<void> {
        if (!this.isConnected) {
            return;
        }

        await disconnect();

        this.isConnected = false;
        return;
    }
}

// Add to container
container.register(MongooseDatabaseAdapter, {
    useValue: new MongooseDatabaseAdapter(process.env.MONGO_URI!)
});
