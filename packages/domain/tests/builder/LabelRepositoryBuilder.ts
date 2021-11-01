import { Label, LabelRepository } from '@thullo/domain';

export class LabelRepositoryBuilder {
    private getAll: () => Promise<Label[]> = () => Promise.resolve([]);

    withGetAll(getAll: () => Promise<Label[]>) {
        this.getAll = getAll;
        return this;
    }

    build(): LabelRepository {
        return {
            getAll: this.getAll,
        };
    }
}