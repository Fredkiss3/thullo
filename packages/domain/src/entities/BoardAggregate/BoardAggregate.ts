import { BoardId } from '../Board';
import { List, ListId } from '../List';
import { Card, CardId } from '../Card';
import { Member, MemberId } from '../Member';
// import { Label } from '../Label';
import { randomUUID } from 'crypto';

type CardsByLists = Record<ListId, Card[]>;
type ListsById = Record<ListId, List>;

interface BoardAggregateData {
    lists: List[];
    cards: Card[];
    participants: Member[];
}

export class OperationUnauthorizedError extends Error {
    constructor(message: string) {
        super(message);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ListNotFoundError);
        }

        // For custom errors, we should explicitly set prototypes
        // Or else it will considers this as an "Error"
        Object.setPrototypeOf(this, OperationUnauthorizedError.prototype);
        this.name = 'OperationUnauthorizedError';
    }
}
export class ListNotFoundError extends Error {
    constructor(message: string) {
        super(message);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ListNotFoundError);
        }

        // For custom errors, we should explicitly set prototypes
        // Or else it will considers this as an "Error"
        Object.setPrototypeOf(this, ListNotFoundError.prototype);
        this.name = 'ListNotFoundError';
    }
}

export class BoardAggregate {
    private _cardsByListIds: CardsByLists;

    constructor(
        private boardId: BoardId,
        private _ownerId: MemberId,
        private _data: BoardAggregateData
    ) {
        this._cardsByListIds = {};
        this.orderCardsByLists();
    }

    private orderCardsByLists(): void {
        for (const list of this._data.lists) {
            this._cardsByListIds[list.id] = this._data.cards
                .filter(({ parentListId }) => parentListId === list.id)
                .sort((a, b) => a.position - b.position);
        }
    }

    addMemberToBoard(member: Member): void {
        if (member.id !== this._ownerId) {
            if (
                this._data.participants.find(({ id }) => id === member.id) ===
                undefined
            ) {
                this._data.participants = [...this._data.participants, member];
            } else {
                throw new OperationUnauthorizedError("Ce membre participe déjà au tableau")
            }
        }
    }

    get participants(): Readonly<Member>[] {
        return this._data.participants;
    }

    get lists(): Readonly<ListsById> {
        return this._data.lists.reduce((acc, l) => {
            return {
                ...acc,
                [l.id]: l
            };
        }, {} as Record<ListId, List>);
    }

    get cardsByLists(): Readonly<CardsByLists> {
        return this._cardsByListIds;
    }

    addList(name: string, position?: number): ListId {
        const id = randomUUID();

        if (position !== undefined) {
            for (const list of this._data.lists) {
                if (list.position >= position) {
                    list.position++;
                }
            }
        }

        this._data.lists.push({
            id,
            boardId: this.boardId,
            position: position ?? this._data.lists.length,
            name
        });

        return id;
    }

    addCardToList(title: string, listId: ListId): CardId {
        const list = this._data.lists.find(({ id }) => id === listId);

        if (list === undefined) {
            throw new ListNotFoundError(
                "cette liste n'existe pas dans le tableau"
            );
        }

        const card: Card = {
            id: randomUUID(),
            position: 0,
            parentListId: listId,
            title,
            attachments: [],
            labels: [],
            coverURL: null,
            description: '',
            comments: []
        };

        this._data.cards.push(card);

        this.orderCardsByLists();

        return card.id;
    }

    get ownerId(): MemberId { return this._ownerId}
}
