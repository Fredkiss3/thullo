import mongoose from 'mongoose';
import { container, singleton } from 'tsyringe';

@singleton()
export class Database {
    private isConnected: boolean = false;

    constructor(private uri: string) {}

    async connect(): Promise<void> {
        if (this.isConnected) {
            return;
        }

        await mongoose.connect(this.uri);
        this.isConnected = true;
    }
}

// Add to container
container.register(Database, {
    useValue: new Database(process.env.MONGO_URI!)
});
