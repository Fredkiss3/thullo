import {
    RenameListRequest,
    RenameListUseCase,
    RenameListPresenter,
    RenameListResponse,
    BoardAggregate,
    BoardAggregateBuilder,
    Member
} from '../../src';
import { v4 as uuidv4 } from 'uuid';
import { BoardAggregateRepositoryBuilder } from '../builder/BoardAggregateRepositoryBuilder';

const presenter = new (class implements RenameListPresenter {
    response?: RenameListResponse | null;

    present(response: RenameListResponse): void {
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

const request: RenameListRequest = {
    listId: todoListID,
    boardId: BOARD_ID,
    newName: 'newName',
    requestedBy: admin.id
};

describe('RenameList Use case', () => {
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

        // Given
        const useCase = new RenameListUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors).toBeNull();
        expect(aggregateExpected!).not.toBeFalsy();
        expect(aggregateExpected!.listsByIds[todoListID].name).toBe('newName');
    });

    it('Should show error if board does not exist', async () => {
        // Given
        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(() => Promise.resolve(null))
            .build();

        // Given
        const useCase = new RenameListUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors).not.toBeNull();
        expect(presenter.response?.errors?.boardId).toHaveLength(1);
    });

    it('should show error if list does not exist', async () => {
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

        const useCase = new RenameListUseCase(boardAggregateRepository);

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
            .withParticipants([])
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(() => Promise.resolve(aggregate))
            .build();

        const useCase = new RenameListUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors).not.toBeNull();
        expect(presenter.response?.errors?.requestedBy).toHaveLength(1);
    });

    describe('Invalid Requests', () => {
        const dataset: { label: string; request: RenameListRequest }[] = [
            {
                label: 'Empty name',
                request: {
                    ...request,
                    newName: ''
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

                // Given
                const useCase = new RenameListUseCase(boardAggregateRepository);

                // When
                await useCase.execute(request, presenter);

                // Then
                expect(presenter.response!.errors).not.toBe(null);
                expect(aggregateExpected!).toBeFalsy();
            }
        );
    });
});
