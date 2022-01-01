import { v4 as uuidv4 } from 'uuid';
import { BoardId } from '../entities/Board';
import { BoardAggregate } from '../entities/BoardAggregate';
import { Card } from '../entities/Card';
import { List } from '../entities/List';
import { Participation } from '../entities/Participation';
import { PartialOmit } from '../lib/types';

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

    public withCards(
        cards: PartialOmit<
            Card,
            'comments' | 'attachments' | 'labels' | 'coverURL' | 'description'
        >[]
    ): BoardAggregateBuilder {
        this.cards = cards.map((card) => ({
            ...card,
            description: card.description ?? '',
            comments: card.comments ?? [],
            attachments: card.attachments ?? [],
            labels: card.labels ?? [],
            coverURL: card.coverURL ?? null
        }));
        return this;
    }

    public withLists(
        lists: PartialOmit<List, 'boardId'>[]
    ): BoardAggregateBuilder {
        this.lists = lists.map((list) => ({ ...list, boardId: this.boardId }));
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
