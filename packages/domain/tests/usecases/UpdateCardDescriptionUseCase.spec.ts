import {
    UpdateCardDescriptionRequest,
    UpdateCardDescriptionPresenter,
    UpdateCardDescriptionResponse,
    Member,
    Card,
    BoardAggregate,
    BoardAggregateBuilder,
    UpdateCardDescriptionUseCase
} from '../../src';
import { v4 as uuidv4 } from 'uuid';
import { BoardAggregateRepositoryBuilder } from '../builder/BoardAggregateRepositoryBuilder';

const presenter = new (class implements UpdateCardDescriptionPresenter {
    response?: UpdateCardDescriptionResponse | null;

    present(response: UpdateCardDescriptionResponse): void {
        this.response = response;
    }
})();

const BOARD_ID = uuidv4();
const cardId = uuidv4();
const todoListID = uuidv4();

const admin: Member = {
    id: uuidv4(),
    login: 'admin',
    name: 'admin',
    avatarURL: 'https://thispersondoesnotexist.com/image',
    email: 'admin@thullo.com'
};

const cardDetails: Card = {
    id: cardId,
    title: 'Card title',
    description: 'Card description',
    parentListId: todoListID,
    labels: [],
    comments: [],
    attachments: [],
    cover: null
};

const request: UpdateCardDescriptionRequest = {
    boardId: BOARD_ID,
    cardId,
    description: 'New description',
    requestedBy: admin.id
};

describe('UpdateCardDescription Use case', () => {
    it('is successful', async () => {
        // Given
        let aggregateExpected: BoardAggregate | null = null;

        const aggregate: BoardAggregate = new BoardAggregateBuilder()
            .withBoardId(BOARD_ID)
            .withLists([
                {
                    id: todoListID,
                    name: 'Todo',
                    position: 0
                }
            ])
            .withCards([cardDetails])
            .withParticipants([
                {
                    isAdmin: true,
                    member: admin
                }
            ])
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(() => Promise.resolve(aggregate))
            .withSaveAggregate((aggregate) => {
                aggregateExpected = aggregate;
                return Promise.resolve(aggregate);
            })
            .build();

        const useCase = new UpdateCardDescriptionUseCase(
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected!).not.toBeFalsy();
        expect(aggregateExpected!.getCardById(cardId).description).toBe(
            'New description'
        );
    });

    it('should show error if user is not a participant of the board', async () => {
        // Given
        let aggregateExpected: BoardAggregate | null = null;
        const aggregate: BoardAggregate = new BoardAggregateBuilder()
            .withBoardId(BOARD_ID)
            .withLists([
                {
                    id: todoListID,
                    name: 'Todo',
                    position: 0
                }
            ])
            .withIsPrivate(false)
            .withCards([cardDetails])
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(() => Promise.resolve(aggregate))
            .withSaveAggregate((aggregate) => {
                aggregateExpected = aggregate;
                return Promise.resolve(aggregate);
            })
            .build();

        const useCase = new UpdateCardDescriptionUseCase(
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected).toBeNull();
        expect(presenter.response?.errors?.requestedBy).toHaveLength(1);
    });

    it('should work even if user is not an admin of the board', async () => {
        // Given
        let aggregateExpected: BoardAggregate | null = null;
        const aggregate: BoardAggregate = new BoardAggregateBuilder()
            .withBoardId(BOARD_ID)
            .withLists([
                {
                    id: todoListID,
                    name: 'Todo',
                    position: 0
                }
            ])
            .withIsPrivate(false)
            .withCards([cardDetails])
            .withParticipants([
                {
                    isAdmin: false,
                    member: admin
                }
            ])
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(() => Promise.resolve(aggregate))
            .withSaveAggregate((aggregate) => {
                aggregateExpected = aggregate;
                return Promise.resolve(aggregate);
            })
            .build();

        const useCase = new UpdateCardDescriptionUseCase(
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected!).not.toBeFalsy();
        expect(aggregateExpected!.getCardById(cardId).description).toBe(
            'New description'
        );
    });

    it('should show error if the board does not exists', async () => {
        // Given
        let aggregateExpected: BoardAggregate | null = null;

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(() => Promise.resolve(null))
            .withSaveAggregate((aggregate) => {
                aggregateExpected = aggregate;
                return Promise.resolve(aggregate);
            })
            .build();

        const useCase = new UpdateCardDescriptionUseCase(
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected).toBeNull();
        expect(presenter.response?.errors?.boardId).toHaveLength(1);
    });

    it('should show error if the card does not exists', async () => {
        // Given
        let aggregateExpected: BoardAggregate | null = null;

        const aggregate: BoardAggregate = new BoardAggregateBuilder()
            .withBoardId(BOARD_ID)
            .withLists([
                {
                    id: todoListID,
                    name: 'Todo',
                    position: 0
                }
            ])
            .withParticipants([
                {
                    isAdmin: true,
                    member: admin
                }
            ])
            .withCards([])
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(() => Promise.resolve(aggregate))
            .withSaveAggregate((aggregate) => {
                aggregateExpected = aggregate;
                return Promise.resolve(aggregate);
            })
            .build();

        const useCase = new UpdateCardDescriptionUseCase(
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected).toBeNull();
        expect(presenter.response?.errors?.cardId).toHaveLength(1);
    });

    it('should work even with empty description', async () => {
        // Given
        let aggregateExpected: BoardAggregate | null = null;

        const aggregate: BoardAggregate = new BoardAggregateBuilder()
            .withBoardId(BOARD_ID)
            .withLists([
                {
                    id: todoListID,
                    name: 'Todo',
                    position: 0
                }
            ])
            .withParticipants([
                {
                    isAdmin: true,
                    member: admin
                }
            ])
            .withCards([cardDetails])
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(() => Promise.resolve(aggregate))
            .withSaveAggregate((aggregate) => {
                aggregateExpected = aggregate;
                return Promise.resolve(aggregate);
            })
            .build();

        const useCase = new UpdateCardDescriptionUseCase(
            boardAggregateRepository
        );

        // When
        await useCase.execute(
            {
                ...request,
                description: ''
            },
            presenter
        );

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected).not.toBeNull();
        expect(aggregateExpected!.getCardById(cardId).description).toBe('');
    });

    describe('Invalid Requests', () => {
        const dataset: {
            label: string;
            request: UpdateCardDescriptionRequest;
        }[] = [
            {
                label: 'Empty card id',
                request: {
                    ...request,
                    cardId: ''
                }
            },
            {
                label: 'Empty board id',
                request: {
                    ...request,
                    boardId: ''
                }
            },
            {
                label: 'Empty requested by',
                request: {
                    ...request,
                    requestedBy: ''
                }
            }
        ];

        it.each(dataset)(
            'shows errors with invalid request : "$label"',
            async ({ request }) => {
                let aggregateExpected: BoardAggregate | null = null;

                const aggregate: BoardAggregate = new BoardAggregateBuilder()
                    .withBoardId(BOARD_ID)
                    .withLists([
                        {
                            id: todoListID,
                            name: 'Todo',
                            position: 0
                        }
                    ])
                    .withCards([cardDetails])
                    .withParticipants([
                        {
                            isAdmin: true,
                            member: admin
                        }
                    ])
                    .build();

                const boardAggregateRepository =
                    new BoardAggregateRepositoryBuilder()
                        .withGetBoardAggregateById(() =>
                            Promise.resolve(aggregate)
                        )
                        .withSaveAggregate((aggregate) => {
                            aggregateExpected = aggregate;
                            return Promise.resolve(aggregate);
                        })
                        .build();

                const useCase = new UpdateCardDescriptionUseCase(
                    boardAggregateRepository
                );

                // When
                await useCase.execute(request, presenter);

                // Then
                expect(presenter.response).not.toBe(null);
                expect(aggregateExpected).toBeNull();
                expect(presenter.response?.errors).not.toBeNull();
            }
        );
    });
});
