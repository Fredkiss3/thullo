import {
    RenameCardRequest,
    RenameCardUseCase,
    RenameCardPresenter,
    RenameCardResponse,
    Member,
    Card,
    BoardAggregate,
    BoardAggregateBuilder
} from '../../src';
import { v4 as uuidv4 } from 'uuid';
import { BoardAggregateRepositoryBuilder } from '../builder/BoardAggregateRepositoryBuilder';

const presenter = new (class implements RenameCardPresenter {
    response?: RenameCardResponse | null;

    present(response: RenameCardResponse): void {
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

const request: RenameCardRequest = {
    boardId: BOARD_ID,
    requestedBy: admin.id,
    cardId,
    title: 'new title'
};

describe('RenameCard Use case', () => {
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

        const useCase = new RenameCardUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected!).not.toBeFalsy();
        expect(aggregateExpected!.getCardById(cardId).title).toBe('new title');
    });

    it('should show error if the user is not a participant of the board', async () => {
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

        const useCase = new RenameCardUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected).toBeNull();
        expect(presenter.response?.errors?.requestedBy).toHaveLength(1);
    });

    it('should work even if the user is not an admin of the board', async () => {
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

        const useCase = new RenameCardUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected!).not.toBeFalsy();
        expect(aggregateExpected!.getCardById(cardId).title).toBe('new title');
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

        const useCase = new RenameCardUseCase(boardAggregateRepository);

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
            .withCards([])
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

        const useCase = new RenameCardUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected).toBeNull();
        expect(presenter.response?.errors?.cardId).toHaveLength(1);
    });

    describe('Invalid Requests', () => {
        const dataset: { label: string; request: RenameCardRequest }[] = [
            {
                label: 'Empty title',
                request: {
                    ...request,
                    title: ''
                }
            },
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
            }
        ];

        it.each(dataset)(
            'shows errors with invalid request : "$label"',
            async ({ request }) => {
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

                const useCase = new RenameCardUseCase(boardAggregateRepository);

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
