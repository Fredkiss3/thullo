import { Attachment, AttachmentRepository } from '@thullo/domain';

export class AttachmentRepositoryBuilder {
    private getAll: () => Promise<Attachment[]> = () => Promise.resolve([]);

    withGetAll(getAll: () => Promise<Attachment[]>) {
        this.getAll = getAll;
        return this;
    }

    build(): AttachmentRepository {
        return {
            getAll: this.getAll,
        };
    }
}