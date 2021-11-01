import { Card, CardRepository } from '@thullo/domain';

export class CardRepositoryBuilder {
    private getAll: () => Promise<Card[]> = () => Promise.resolve([]);

    withGetAll(getAll: () => Promise<Card[]>) {
        this.getAll = getAll;
        return this;
    }

    build(): CardRepository {
        return {
            getAll: this.getAll,
        };
    }
}