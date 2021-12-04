import { BoardAggregate, Card, List, Participation } from '@thullo/domain';
import { v4 as uuidv4 } from 'uuid';
import { BoardId } from './../../src/entities/Board/Board';

export class BoardAggregateBuilder {
    private participants: Participation[] = [];
    private boardId: BoardId = uuidv4();
    private name: string = 'Board';
    private description: string | null = null;
    private isPrivate: boolean = false;
    private cards: Card[] = [];
    private lists: List[] = [];

    public withBoardId(boardId: BoardId): BoardAggregateBuilder {
        this.boardId = boardId;
        return this;
    }

    public withName(name: string): BoardAggregateBuilder {
        this.name = name;
        return this;
    }

    public withDescription(description: string | null): BoardAggregateBuilder {
        this.description = description;
        return this;
    }

    public withIsPrivate(isPrivate: boolean): BoardAggregateBuilder {
        this.isPrivate = isPrivate;
        return this;
    }

    public withCards(cards: Card[]): BoardAggregateBuilder {
        this.cards = [...cards];
        return this;
    }

    public withLists(lists: List[]): BoardAggregateBuilder {
        this.lists = [...lists];
        return this;
    }

    public withParticipants(
        participants: Participation[]
    ): BoardAggregateBuilder {
        this.participants = [...participants];
        return this;
    }

    build(): BoardAggregate {
        return new BoardAggregate(
            {
                id: this.boardId,
                name: this.name,
                description: this.description,
                private: this.isPrivate
            },
            {
                cards: this.cards,
                lists: this.lists,
                participants: this.participants
            }
        );
    }
}
