iimport { __entt__, __entt__Repository } from '@thullo/domain';

export class __entt__RepositoryBuilder {
    private getAll: () => Promise<__entt__[]> = () => Promise.resolve([]);

    withGetAll(getAll: () => Promise<__entt__[]>) {
        this.getAll = getAll;
        return this;
    }

    build(): __entt__Repository {
        return {
            getAll: this.getAll,
        };
    }
}