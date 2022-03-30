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
    // the cards are sorted by listId and position
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
    private _cardsByListIds: CardsByLists = {};
    private _listsById: ListsById = {};
    private _participants: Participation[] = [];

    constructor(private _board: BoardData, data: BoardAggregateData) {
        this._participants = data.participants;

        // initialize lists
        for (const list of data.lists) {
            this._cardsByListIds[list.id] = data.cards.filter(
                ({ parentListId }) => parentListId === list.id
            );
        }

        for (const list of data.lists) {
            this._listsById[list.id] = list;
        }
    }

    private checkAdminOrThrowError(memberId: MemberId, message: string): void {
        if (
            this._participants.find(
                ({ member: { id }, isAdmin }) => id === memberId && isAdmin
            ) === undefined
        ) {
            throw new OperationUnauthorizedError(message);
        }
    }

    addMemberToBoard(member: Member): void {
        if (
            this._participants.find(
                ({ member: { id } }) => id === member.id
            ) === undefined
        ) {
            this._participants = [
                ...this._participants,
                { isAdmin: false, member }
            ];
        }
    }

    addList(name: string): ListId {
        const id = uuidv4();

        this._listsById[id] = {
            id,
            name,
            boardId: this._board.id,
            position: Object.keys(this._listsById).length
        };

        this._cardsByListIds[id] = [];

        return id;
    }

    addCardToList(title: string, listId: ListId): Card {
        const list = this._listsById[listId];

        if (list === undefined) {
            throw new ListNotFoundError(
                "cette liste n'existe pas dans le tableau"
            );
        }

        const card: Card = {
            id: uuidv4(),
            parentListId: listId,
            title,
            attachments: [],
            labels: [],
            cover: null,
            description: '',
            comments: []
        };

        this._cardsByListIds[listId].push(card);

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

    removeListFromBoard(listId: ListId) {
        if (listId in this.listsByIds) {
            const { [listId]: list, ...rest } = this._listsById;
            const { [listId]: cards, ...restCards } = this._cardsByListIds;

            this._listsById = rest;
            this._cardsByListIds = restCards;
        }
    }

    removeMemberFromBoard(member: Member, initiatorId: MemberId) {
        this.checkAdminOrThrowError(
            initiatorId,
            "Vous n'avez pas le droit de retirer un membre de ce" +
                " tableau car vous n'êtes pas un admin sur ce tableau"
        );

        const memberFound = this._participants.find(
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
            this._participants = this._participants.filter(
                ({ member: { id } }) => id !== member.id
            );
        }
    }

    /**
     * move a card to another list
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
                "La liste de destination n'existe pas dans le tableau"
            );
        }

        // the card should exist
        let cardToMove: Card | undefined = undefined;

        for (const listId in this._cardsByListIds) {
            const card = this._cardsByListIds[listId].find(
                ({ id }) => id === cardId
            );

            if (card !== undefined) {
                cardToMove = card;
                break;
            }
        }

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

        // remove the card from the old list
        this._cardsByListIds[cardToMove.parentListId] = this._cardsByListIds[
            cardToMove.parentListId
        ].filter(({ id }) => id !== cardId);

        // add the card to the new list
        this._cardsByListIds[destinationListId].splice(
            destinationPosition,
            0,
            cardToMove
        );

        // change the parent list of the card
        cardToMove.parentListId = destinationListId;
    }

    isParticipant(memberId: MemberId) {
        return this._participants.some(({ member: { id } }) => id === memberId);
    }

    isAdmin(memberId: MemberId) {
        const member = this._participants.find(
            ({ member: { id } }) => id === memberId
        );

        return member?.isAdmin ?? false;
    }

    getCardById(cardId: CardId): Card {
        const card = Object.values(this._cardsByListIds)
            .reduce((acc, list) => acc.concat(list), [])
            .find(({ id }) => id === cardId);

        if (card === undefined) {
            throw new CardNotFoundError(
                "cette carte n'existe pas dans le tableau"
            );
        }

        return card;
    }

    // getters & setters
    get participants(): Readonly<Participation>[] {
        return this._participants;
    }

    get listsByIds(): Readonly<ListsById> {
        return this._listsById;
    }

    /**
     * get the list of cards sorted by position and grouped by list
     */
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
