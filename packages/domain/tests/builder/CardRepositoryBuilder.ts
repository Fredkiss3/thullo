import { Card, CardRepository } from '@thullo/domain';

export class CardRepositoryBuilder {
    private getCardById: (id: string) => Promise<Card | null> = (id) =>
        Promise.resolve(null);

    public withGetCardById(
        getCardById: (id: string) => Promise<Card | null>
    ): CardRepositoryBuilder {
        this.getCardById = getCardById;
        return this;
    }

    build(): CardRepository {
        return {
            getCardById: this.getCardById
        };
    }
}
