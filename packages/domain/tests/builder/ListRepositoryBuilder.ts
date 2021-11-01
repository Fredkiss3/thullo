import { List, ListRepository } from '@thullo/domain';

export class ListRepositoryBuilder {
    private getAll: () => Promise<List[]> = () => Promise.resolve([]);

    withGetAll(getAll: () => Promise<List[]>) {
        this.getAll = getAll;
        return this;
    }

    build(): ListRepository {
        return {
            getAll: this.getAll,
        };
    }
}