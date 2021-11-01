import { Attachment } from './';

export interface AttachmentRepository {
    getAttachmentById(id: string): Promise<Attachment | null>;
    getAll(): Promise<Attachment[]>;
}
