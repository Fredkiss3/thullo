import {
    DeleteListRequest,
    DeleteListUseCase,
    DeleteListPresenter,
    DeleteListResponse,
    Member,
    BoardAggregate,
    BoardAggregateBuilder
} from '../../src';
import { v4 as uuidv4 } from 'uuid';
import { BoardAggregateRepositoryBuilder } from '../builder/BoardAggregateRepositoryBuilder';

const presenter = new (class implements DeleteListPresenter {
    response?: DeleteListResponse | null;

    present(response: DeleteListResponse): void {
        this.response = response;
    }
})();

const BOARD_ID = uuidv4();
const todoListID = uuidv4();

const admin: Member = {
    id: uuidv4(),
    login: 'admin',
    name: 'admin',
    avatarURL: 'https://thispersondoesnotexist.com/image',
    email: 'admin@thullo.com'
};

const request: DeleteListRequest = {
    listId: todoListID,
    boardId: BOARD_ID,
    requestedBy: admin.id
};

describe('DeleteList Use case', () => {
    it('is successful', async () => {
        // Given
        let aggregateExpected: BoardAggregate;

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
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(() => Promise.resolve(aggregate))
            .withSaveAggregate(async (board) => {
                aggregateExpected = board;
                return aggregateExpected;
            })
            .build();

        const useCase = new DeleteListUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors).toBeNull();
        expect(aggregateExpected!).not.toBeFalsy();
        expect(Object.keys(aggregateExpected!.listsByIds)).toHaveLength(0);
        expect(todoListID in aggregateExpected!.listsByIds).toBe(false);
    });

    it('should delete also the cards of the list when the list is deleted', async () => {
        // Given
        let aggregateExpected: BoardAggregate;

        const aggregate: BoardAggregate = new BoardAggregateBuilder()
            .withBoardId(BOARD_ID)
            .withLists([
                {
                    id: todoListID,
                    name: 'Todo',
                    position: 0
                }
            ])
            .withCards([
                {
                    id: uuidv4(),
                    parentListId: todoListID,
                    title: 'Card 1',
                    description: 'Card 1 description'
                },
                {
                    id: uuidv4(),
                    parentListId: todoListID,
                    title: 'Card 2',
                    description: 'Card 2 description'
                }
            ])
            .withParticipants([
                {
                    isAdmin: true,
                    member: admin
                }
            ])
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(() => Promise.resolve(aggregate))
            .withSaveAggregate(async (board) => {
                aggregateExpected = board;
                return aggregateExpected;
            })
            .build();

        const useCase = new DeleteListUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors).toBeNull();
        expect(todoListID in aggregateExpected!.cardsByLists).toBe(false);
    });

    it('should show error if board does not exists', async () => {
        // Given
        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(() => Promise.resolve(null))
            .build();

        const useCase = new DeleteListUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors).not.toBeNull();
        expect(presenter.response?.errors?.boardId).toHaveLength(1);
    });

    it('should show error if list does not exists', async () => {
        // Given
        const aggregate: BoardAggregate = new BoardAggregateBuilder()
            .withBoardId(BOARD_ID)
            .withLists([
                {
                    id: uuidv4(),
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
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(() => Promise.resolve(aggregate))
            .build();

        const useCase = new DeleteListUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors).not.toBeNull();
        expect(presenter.response?.errors?.listId).toHaveLength(1);
    });

    it('should show error if user is not a participant of the board', async () => {
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
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(() => Promise.resolve(aggregate))
            .build();

        const useCase = new DeleteListUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors).not.toBeNull();
        expect(presenter.response?.errors?.requestedBy).toHaveLength(1);
    });

    describe('Invalid Requests', () => {
        const dataset: { label: string; request: DeleteListRequest }[] = [
            {
                label: 'Empty board id',
                request: {
                    ...request,
                    boardId: ''
                }
            },
            {
                label: 'Empty list id',
                request: {
                    ...request,
                    listId: ''
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
                // Given
                let aggregateExpected: BoardAggregate;

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
                    .build();

                const boardAggregateRepository =
                    new BoardAggregateRepositoryBuilder()
                        .withGetBoardAggregateById(() =>
                            Promise.resolve(aggregate)
                        )
                        .withSaveAggregate(async (board) => {
                            aggregateExpected = board;
                            return aggregateExpected;
                        })
                        .build();

                const useCase = new DeleteListUseCase(boardAggregateRepository);

                // When
                await useCase.execute(request, presenter);

                // Then
                expect(presenter.response!.errors).not.toBe(null);
                expect(aggregateExpected!).toBeFalsy();
            }
        );
    });
});
