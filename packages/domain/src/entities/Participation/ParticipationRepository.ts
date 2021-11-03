import { Participation } from './';

export interface ParticipationRepository {
    // getParticipationById(id: string): Promise<Participation | null>;
    getAll(): Promise<Participation[]>;
}
