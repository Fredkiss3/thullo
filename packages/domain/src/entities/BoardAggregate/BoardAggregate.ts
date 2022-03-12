import { v4 as uuidv4 } from 'uuid';
import { BoardId } from '../Board';
import { Card, CardId } from '../Card';
import { List, ListId } from '../List';
import { Member, MemberId } from '../Member';
import { Participation } from '../Participation';
import {
    CardNotFoundError,
    InvalidPositionError,
    ListNotFoundError,
    MemberNotInBoardError,
    OperationUnauthorizedError
} from './Exceptions';

type CardsByLists = Record<ListId, Card[]>;
type ListsById = Record<ListId, List>;

interface BoardAggregateData {
    lists: List[];
    cards: Card[];
    participants: Participation[];
}

interface BoardData {
    id: BoardId;
    name: string;
    description: string | null;
    private: boolean;
}

export class BoardAggregate {
    private _cardsByListIds: CardsByLists;

    constructor(private _board: BoardData, private _data: BoardAggregateData) {
        this._cardsByListIds = {};
        this.orderCardsByLists();
    }

    private orderCardsByLists(): void {
        // Order the cards by list ids and position
        for (const list of this._data.lists) {
            this._cardsByListIds[list.id] = this._data.cards
                .filter(({ parentListId }) => parentListId === list.id)
                .sort((a, b) => a.position - b.position);
        }
    }

    addMemberToBoard(member: Member): void {
        if (
            this._data.participants.find(
                ({ member: { id } }) => id === member.id
            ) === undefined
        ) {
            this._data.participants = [
                ...this._data.participants,
                { isAdmin: false, member }
            ];
        }
    }

    addList(name: string): ListId {
        const id = uuidv4();

        this._data.lists.push({
            id,
            boardId: this._board.id,
            position: this._data.lists.length,
            name
        });

        return id;
    }

    addCardToList(title: string, listId: ListId): Card {
        const list = this._data.lists.find(({ id }) => id === listId);

        if (list === undefined) {
            throw new ListNotFoundError(
                "cette liste n'existe pas dans le tableau"
            );
        }

        const card: Card = {
            id: uuidv4(),
            position: 0,
            parentListId: listId,
            title,
            attachments: [],
            labels: [],
            cover: null,
            description: '',
            comments: []
        };

        this._data.cards.push(card);

        this.orderCardsByLists();

        return card;
    }

    setVisibility(isPrivate: boolean, initiatorId: MemberId): void {
        this.checkAdminOrThrowError(
            initiatorId,
            "Vous n'avez pas le droit de changer la visibilité de ce" +
                " tableau car vous n'êtes pas un admin sur ce tableau"
        );
        this._board.private = isPrivate;
    }

    setName(name: string, initiatorId: MemberId) {
        this.checkAdminOrThrowError(
            initiatorId,
            "Vous n'avez pas le droit de changer le nom de ce" +
                " tableau car vous n'êtes pas un admin sur ce tableau"
        );
        this._board.name = name;
    }

    setDescription(description: string | null, initiatorId: MemberId) {
        this.checkAdminOrThrowError(
            initiatorId,
            "Vous n'avez pas le droit de changer la description de ce" +
                " tableau car vous n'êtes pas un admin sur ce tableau"
        );
        this._board.description = description;
    }

    private checkAdminOrThrowError(memberId: MemberId, message: string): void {
        if (
            this._data.participants.find(
                ({ member: { id }, isAdmin }) => id === memberId && isAdmin
            ) === undefined
        ) {
            throw new OperationUnauthorizedError(message);
        }
    }

    removeMemberFromBoard(member: Member, initiatorId: MemberId) {
        this.checkAdminOrThrowError(
            initiatorId,
            "Vous n'avez pas le droit de retirer un membre de ce" +
                " tableau car vous n'êtes pas un admin sur ce tableau"
        );

        const memberFound = this._data.participants.find(
            ({ member: { id } }) => id === member.id
        );

        if (memberFound === undefined) {
            throw new MemberNotInBoardError(
                "Ce membre n'est pas dans ce tableau"
            );
        } else if (memberFound.isAdmin) {
            throw new OperationUnauthorizedError(
                "Vous n'avez pas le droit de retirer un membre de ce" +
                    ' tableau car ce membre est admin sur ce tableau'
            );
        } else if (member.id === initiatorId) {
            throw new OperationUnauthorizedError(
                'Vous ne pouvez pas vous retirer vous-même du tableau'
            );
        } else {
            this._data.participants = this._data.participants.filter(
                ({ member: { id } }) => id !== member.id
            );
        }
    }

    /**
     * move a card to another list and
     * change change the positions of cards which where
     * present in the old list
     */
    moveCard(
        cardId: CardId,
        destinationListId: ListId,
        destinationPosition: number
    ) {
        // the list should exist
        const list = this._cardsByListIds[destinationListId];

        if (list === undefined) {
            throw new ListNotFoundError(
                "cette liste n'existe pas dans le tableau"
            );
        }

        // the card should exist
        const cardToMove = this._data.cards.find(({ id }) => id === cardId);

        if (cardToMove === undefined) {
            throw new CardNotFoundError(
                "cette carte n'existe pas dans le tableau"
            );
        }

        // No negative position
        if (destinationPosition < 0) {
            throw new InvalidPositionError(
                'La position de la carte doit être supérieure à 0'
            );
        }

        // No position higher than the number of cards in the list
        if (
            destinationPosition > list.length ||
            (cardToMove.parentListId === destinationListId &&
                destinationPosition > list.length - 1)
        ) {
            throw new InvalidPositionError(
                'La position de la carte doit être inférieure à la taille de la liste'
            );
        }

        // update positions in the old list by moving all cards that were
        // below the card to move up
        for (const card of this._cardsByListIds[cardToMove.parentListId]) {
            if (card.position > cardToMove.position) {
                card.position--;
            }
        }

        // update positions in the new list by moving all cards that should be
        // below the card to move down
        for (const card of this._cardsByListIds[destinationListId]) {
            if (card.position >= destinationPosition) {
                card.position++;
            }
        }

        // move the card to the other list
        // and update the position accordingly
        cardToMove.parentListId = destinationListId;
        cardToMove.position = destinationPosition;

        this.orderCardsByLists();
    }

    isParticipant(memberId: MemberId) {
        return this._data.participants.some(
            ({ member: { id } }) => id === memberId
        );
    }

    isAdmin(memberId: MemberId) {
        const member = this._data.participants.find(
            ({ member: { id } }) => id === memberId
        );

        return member?.isAdmin ?? false;
    }

    // getters & setters
    get participants(): Readonly<Participation>[] {
        return this._data.participants;
    }

    get listsByIds(): Readonly<ListsById> {
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

    get isPrivate(): boolean {
        return this._board.private;
    }

    get name(): string {
        return this._board.name;
    }

    get description(): string | null {
        return this._board.description;
    }

    get boardId(): BoardId {
        return this._board.id;
    }
}
