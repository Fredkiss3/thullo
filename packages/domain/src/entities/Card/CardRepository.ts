import { Card } from './';

export interface CardRepository {
    getCardById(id: string): Promise<Card | null>;
}
