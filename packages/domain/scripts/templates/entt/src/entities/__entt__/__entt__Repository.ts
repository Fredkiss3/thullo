import { __entt__ } from './';

export interface __entt__Repository {
    get__entt__ById(id: string): Promise<__entt__ | null>;
    getAll(): Promise<__entt__[]>;
}
