import {
    UpdateCardCoverRequest,
    UpdateCardCoverUseCase,
    UpdateCardCoverPresenter,
    UpdateCardCoverResponse,
    Member,
    Card,
    BoardAggregate,
    BoardAggregateBuilder,
    RenameCardUseCase
} from '../../src';
import { v4 as uuidv4 } from 'uuid';
import { BoardAggregateRepositoryBuilder } from '../builder/BoardAggregateRepositoryBuilder';
import { UnsplashGatewayBuilder } from '../builder/UnsplashGatewayBuilder';
import { UnsplashPhotoBuilder } from '../builder/UnsplashPhotoBuilder';

const presenter = new (class implements UpdateCardCoverPresenter {
    response?: UpdateCardCoverResponse | null;

    present(response: UpdateCardCoverResponse): void {
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

const cardCover = new UnsplashPhotoBuilder().build();

const request: UpdateCardCoverRequest = {
    boardId: BOARD_ID,
    cardId,
    coverPhotoId: uuidv4(),
    requestedBy: admin.id
};

describe('UpdateCardCover Use case', () => {
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

        const unsplashGateway = new UnsplashGatewayBuilder()
            .withGetPhoto(() => Promise.resolve(cardCover))
            .build();

        const useCase = new UpdateCardCoverUseCase(
            boardAggregateRepository,
            unsplashGateway
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected!).not.toBeFalsy();
        expect(aggregateExpected!.getCardById(cardId).cover).toBe(cardCover);
    });

    it('should set the card cover to null if no cover photo has been provided', async () => {
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

        const unsplashGateway = new UnsplashGatewayBuilder()
            .withGetPhoto(() => Promise.resolve(null))
            .build();

        const useCase = new UpdateCardCoverUseCase(
            boardAggregateRepository,
            unsplashGateway
        );

        // When
        const { coverPhotoId, ...req } = request;
        await useCase.execute(req, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected).not.toBeNull();
        expect(aggregateExpected!.getCardById(cardId).cover).toBeNull();
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

        const unsplashGateway = new UnsplashGatewayBuilder()
            .withGetPhoto(() => Promise.resolve(cardCover))
            .build();

        const useCase = new UpdateCardCoverUseCase(
            boardAggregateRepository,
            unsplashGateway
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected!).not.toBeFalsy();
        expect(aggregateExpected!.getCardById(cardId).cover).toBe(cardCover);
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

        const unsplashGateway = new UnsplashGatewayBuilder()
            .withGetPhoto(() => Promise.resolve(cardCover))
            .build();

        const useCase = new UpdateCardCoverUseCase(
            boardAggregateRepository,
            unsplashGateway
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected).toBeNull();
        expect(presenter.response?.errors?.requestedBy).toHaveLength(1);
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

        const unsplashGateway = new UnsplashGatewayBuilder()
            .withGetPhoto(() => Promise.resolve(cardCover))
            .build();

        const useCase = new UpdateCardCoverUseCase(
            boardAggregateRepository,
            unsplashGateway
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

        const unsplashGateway = new UnsplashGatewayBuilder()
            .withGetPhoto(() => Promise.resolve(cardCover))
            .build();

        const useCase = new UpdateCardCoverUseCase(
            boardAggregateRepository,
            unsplashGateway
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected).toBeNull();
        expect(presenter.response?.errors?.cardId).toHaveLength(1);
    });

    it('should show error if the coverPhotoId does not correspond to any photo', async () => {
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

        const unsplashGateway = new UnsplashGatewayBuilder()
            .withGetPhoto(() => Promise.resolve(null))
            .build();

        const useCase = new UpdateCardCoverUseCase(
            boardAggregateRepository,
            unsplashGateway
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected).toBeNull();
        expect(presenter.response?.errors?.coverPhotoId).toHaveLength(1);
    });

    describe('Invalid Requests', () => {
        const dataset: { label: string; request: UpdateCardCoverRequest }[] = [
            {
                label: 'Empty board id',
                request: {
                    ...request,
                    boardId: ''
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
                label: 'Empty requestedBy',
                request: {
                    ...request,
                    requestedBy: ''
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

                const unsplashGateway = new UnsplashGatewayBuilder()
                    .withGetPhoto(() => Promise.resolve(cardCover))
                    .build();

                const useCase = new UpdateCardCoverUseCase(
                    boardAggregateRepository,
                    unsplashGateway
                );

                // When
                await useCase.execute(request, presenter);

                // Then
                expect(presenter.response).not.toBe(null);
                expect(aggregateExpected!).toBeNull();
                expect(presenter.response!.errors).not.toBe(null);
            }
        );
    });
});
