import { Attachment } from "../Attachment";
import { ListId } from "../List";

export interface Card {
    id: string;
    parentListId: ListId;
    position: number;
    coverURL: string;
    description: string;
    attachments: Attachment[];
}
