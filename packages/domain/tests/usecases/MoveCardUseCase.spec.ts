import {
    MoveCardRequest,
    MoveCardUseCase,
    MoveCardPresenter,
    MoveCardResponse,
    Member,
    BoardAggregateBuilder,
    BoardAggregate,
    BoardAggregateRepository,
    Card
} from '@thullo/domain';
import { v4 as uuidv4 } from 'uuid';
import { BoardAggregateRepositoryBuilder } from '../builder/BoardAggregateRepositoryBuilder';

const presenter = new (class implements MoveCardPresenter {
    response?: MoveCardResponse | null;

    present(response: MoveCardResponse): void {
        this.response = response;
    }
})();

const BOARD_ID = uuidv4();
const todoListID = uuidv4();
const doneListID = uuidv4();

const firstCard: Card = {
    id: uuidv4(),
    title: 'Todo',
    position: 0,
    parentListId: todoListID,
    comments: [],
    attachments: [],
    labels: [],
    coverURL: null,
    description: ''
};

const admin: Member = {
    id: uuidv4(),
    login: 'admin',
    name: 'admin',
    avatarURL: 'https://thispersondoesnotexist.com/image',
    email: 'admin@thullo.com'
};

const request: MoveCardRequest = {
    boardId: BOARD_ID,
    cardId: firstCard.id,
    destinationListId: doneListID,
    destinationPosition: 0,
    requestedBy: admin.id
};

describe('MoveCard Use case', () => {
    it('is successful', async () => {
        // Given
        const aggregate: BoardAggregate = new BoardAggregateBuilder()
            .withBoardId(BOARD_ID)
            .withLists([
                {
                    id: todoListID,
                    name: 'Todo',
                    position: 0
                },
                {
                    id: doneListID,
                    name: 'Done',
                    position: 1
                }
            ])
            .withCards([firstCard])
            .withParticipants([
                {
                    isAdmin: true,
                    member: admin
                }
            ])
            .build();

        let boardExpected: BoardAggregate;
        const boardAggregateRepository: BoardAggregateRepository =
            new BoardAggregateRepositoryBuilder()
                .withGetBoardAggregateById(async () => {
                    return aggregate;
                })
                .withSave(async (boardAggregate) => {
                    boardExpected = boardAggregate;
                    return boardAggregate;
                })
                .build();

        const useCase = new MoveCardUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).toBeNull();
        expect(boardExpected!).not.toBeFalsy();

        // The card should be moved to the done list
        expect(boardExpected!.cardsByLists[todoListID]).toHaveLength(0);
        expect(boardExpected!.cardsByLists[doneListID]).toHaveLength(1);
        expect(boardExpected!.cardsByLists[doneListID][0].id).toBe(
            firstCard.id
        );
    });

    it('should show errors if user is not a participant of the board', async () => {
        // Given
        const aggregate: BoardAggregate = new BoardAggregateBuilder()
            .withBoardId(BOARD_ID)
            .withLists([
                {
                    id: todoListID,
                    name: 'Todo',
                    position: 0
                }
            ])
            .withCards([firstCard])
            .withParticipants([
                {
                    isAdmin: false,
                    member: admin
                }
            ])
            .build();

        const boardAggregateRepository: BoardAggregateRepository =
            new BoardAggregateRepositoryBuilder()
                .withGetBoardAggregateById(async () => {
                    return aggregate;
                })
                .build();

        const useCase = new MoveCardUseCase(boardAggregateRepository);

        // When
        await useCase.execute(
            {
                ...request,
                destinationListId: todoListID,
                requestedBy: uuidv4()
            },
            presenter
        );

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).not.toBeNull();
        expect(presenter.response!.errors!.requestedBy).toHaveLength(1);
    });

    it('should show errors if card is moved to an inexistant list', async () => {
        // Given
        const aggregate: BoardAggregate = new BoardAggregateBuilder()
            .withBoardId(BOARD_ID)
            .withLists([
                {
                    id: todoListID,
                    name: 'Todo',
                    position: 0
                }
            ])
            .withCards([firstCard])
            .withParticipants([
                {
                    isAdmin: true,
                    member: admin
                }
            ])
            .build();

        const boardAggregateRepository: BoardAggregateRepository =
            new BoardAggregateRepositoryBuilder()
                .withGetBoardAggregateById(async () => {
                    return aggregate;
                })
                .build();

        const useCase = new MoveCardUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).not.toBeNull();
        expect(presenter.response!.errors!.destinationListId).toHaveLength(1);
    });

    it("should show errors if the card moved doesn't exist", async () => {
        // Given
        const aggregate: BoardAggregate = new BoardAggregateBuilder()
            .withBoardId(BOARD_ID)
            .withLists([
                {
                    id: todoListID,
                    name: 'Todo',
                    position: 0
                },
                {
                    id: doneListID,
                    name: 'Done',
                    position: 1
                }
            ])
            .withParticipants([
                {
                    isAdmin: true,
                    member: admin
                }
            ])
            .build();

        const boardAggregateRepository: BoardAggregateRepository =
            new BoardAggregateRepositoryBuilder()
                .withGetBoardAggregateById(async () => {
                    return aggregate;
                })
                .build();

        const useCase = new MoveCardUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).not.toBeNull();
        expect(presenter.response!.errors!.cardId).toHaveLength(1);
    });

    it('should show errors if the destination position is greater than the destination list size', async () => {
        // Given
        const aggregate: BoardAggregate = new BoardAggregateBuilder()
            .withBoardId(BOARD_ID)
            .withLists([
                {
                    id: todoListID,
                    name: 'Todo',
                    position: 0
                },
                {
                    id: doneListID,
                    name: 'Done',
                    position: 1
                }
            ])
            .withCards([firstCard])
            .withParticipants([
                {
                    isAdmin: true,
                    member: admin
                }
            ])
            .build();

        const boardAggregateRepository: BoardAggregateRepository =
            new BoardAggregateRepositoryBuilder()
                .withGetBoardAggregateById(async () => {
                    return aggregate;
                })
                .build();

        const useCase = new MoveCardUseCase(boardAggregateRepository);

        // When
        await useCase.execute(
            {
                ...request,
                destinationListId: doneListID,
                destinationPosition: 1
            },
            presenter
        );

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).not.toBeNull();
        expect(presenter.response!.errors!.destinationPosition).toHaveLength(1);
    });

    describe('Invalid Requests', () => {
        const dataset: { label: string; request: MoveCardRequest }[] = [
            {
                label: 'destinationListId is empty',
                request: {
                    ...request,
                    destinationListId: ''
                }
            },
            {
                label: 'cardId is empty',
                request: {
                    ...request,
                    cardId: ''
                }
            },
            {
                label: 'requestedBy is empty',
                request: {
                    ...request,
                    requestedBy: ''
                }
            },
            {
                label: 'destinationPosition is less than 0',
                request: {
                    ...request,
                    destinationPosition: -1
                }
            }
        ];

        it.each(dataset)(
            'shows errors with invalid request : "$label"',
            async ({ request }) => {
                // Given
                const aggregate: BoardAggregate = new BoardAggregateBuilder()
                    .withBoardId(BOARD_ID)
                    .withLists([
                        {
                            id: todoListID,
                            name: 'Todo',
                            position: 0
                        },
                        {
                            id: doneListID,
                            name: 'Done',
                            position: 1
                        }
                    ])
                    .withCards([firstCard])
                    .withParticipants([
                        {
                            isAdmin: true,
                            member: admin
                        }
                    ])
                    .build();

                let boardExpected: BoardAggregate;
                const boardAggregateRepository: BoardAggregateRepository =
                    new BoardAggregateRepositoryBuilder()
                        .withGetBoardAggregateById(async () => {
                            return aggregate;
                        })
                        .withSave(async (boardAggregate) => {
                            boardExpected = boardAggregate;
                            return boardAggregate;
                        })
                        .build();

                const useCase = new MoveCardUseCase(boardAggregateRepository);

                // When
                await useCase.execute(request, presenter);

                // Then
                expect(presenter.response!.errors).not.toBeNull();
            }
        );
    });
});
