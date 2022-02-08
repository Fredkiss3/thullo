import { Participation } from '../Participation';
import { UnsplashPhoto } from '../../lib/types';

export type BoardId = string;

export interface Board {
    id: BoardId;
    cover: UnsplashPhoto;
    name: string;
    participants: Participation[];
    description: string | null;
    private: boolean;
}
