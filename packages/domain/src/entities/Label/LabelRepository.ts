import { Label } from './';

export interface LabelRepository {
    getLabelById(id: string): Promise<Label | null>;
    getAll(): Promise<Label[]>;
}
