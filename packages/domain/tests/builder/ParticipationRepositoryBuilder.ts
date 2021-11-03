import { Participation, ParticipationRepository } from '@thullo/domain';

export class ParticipationRepositoryBuilder {
    private getAll: () => Promise<Participation[]> = () => Promise.resolve([]);

    withGetAll(getAll: () => Promise<Participation[]>) {
        this.getAll = getAll;
        return this;
    }

    build(): ParticipationRepository {
        return {
            getAll: this.getAll,
        };
    }
}