import { Comment, CommentRepository } from '@thullo/domain';

export class CommentRepositoryBuilder {
    private getAll: () => Promise<Comment[]> = () => Promise.resolve([]);

    withGetAll(getAll: () => Promise<Comment[]>) {
        this.getAll = getAll;
        return this;
    }

    build(): CommentRepository {
        return {
            getAll: this.getAll,
        };
    }
}