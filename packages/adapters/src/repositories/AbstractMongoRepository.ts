import { Model, Schema } from 'mongoose';

export abstract class AbstractMongoRepository<T> {
    schema?: Schema<T & { uuid: string }>;
    model?: Model<T & { uuid: string }>;

    abstract init(): Promise<void>;
}
