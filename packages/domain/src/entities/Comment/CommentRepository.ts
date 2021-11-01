import { Comment } from './';

export interface CommentRepository {
    getCommentById(id: string): Promise<Comment | null>;
    getAll(): Promise<Comment[]>;
}
