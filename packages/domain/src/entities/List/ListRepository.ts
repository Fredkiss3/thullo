import { List } from './';

export interface ListRepository {
    getListById(id: string): Promise<List | null>;
    getAll(): Promise<List[]>;
}
