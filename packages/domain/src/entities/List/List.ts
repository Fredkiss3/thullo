export type ListId = string;

export interface List {
    id: ListId;
    boardId: string;
    position: number;
    name: string;
}
