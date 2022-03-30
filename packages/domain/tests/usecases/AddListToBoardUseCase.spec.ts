import {
    AddListToBoardRequest,
    AddListToBoardUseCase,
    AddListToBoardPresenter,
    AddListToBoardResponse,
    BoardAggregate,
    Member,
    BoardAggregateBuilder
} from '../../src';
import { v4 as uuidv4 } from 'uuid';
import { BoardAggregateRepositoryBuilder } from '../builder/BoardAggregateRepositoryBuilder';

const presenter = new (class implements AddListToBoardPresenter {
    response?: AddListToBoardResponse | null;

    present(response: AddListToBoardResponse): void {
        this.response = response;
    }
})();

const BOARD_ID = uuidv4();

const admin: Member = {
    id: uuidv4(),
    login: 'zeus',
    name: 'Zeus God of thunder',
    avatarURL: 'https://www.photos.com/thunder.png'
};

const request: AddListToBoardRequest = {
    requesterId: admin.id,
    boardId: BOARD_ID,
    name: 'New List'
};

const aggregate = new BoardAggregate(
    {
        id: BOARD_ID,
        name: 'Dev Challenge Boards',
        description: '',
        private: true
    },
    {
        cards: [],
        lists: [],
        participants: [
            {
                isAdmin: true,
                member: admin
            }
        ]
    }
);

describe('AddListToBoard Use case', () => {
    it('is successful', async () => {
        // Given
        let aggregateExpected: BoardAggregate | null = null;

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return aggregate;
            })
            .withSaveAggregate(async (board: BoardAggregate) => {
                aggregateExpected = board;
                return board;
            })
            .build();

        const useCase = new AddListToBoardUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors).toBe(null);
        expect(aggregateExpected).not.toBe(null);

        expect(presenter.response?.list).not.toBe(null);
        expect(presenter.response?.list?.name).toBe(request.name);
    });

    it('should set the position of the new list to the last position + 1', async () => {
        // Given
        let aggregateExpected: BoardAggregate | null = null;

        const aggregate = new BoardAggregateBuilder()
            .withBoardId(BOARD_ID)
            .withName('Dev Challenge Boards')
            .withIsPrivate(true)
            .withLists([
                {
                    id: uuidv4(),
                    name: 'List 1',
                    position: 1
                },
                {
                    id: uuidv4(),
                    name: 'List 2',
                    position: 3
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
            .withGetBoardAggregateById(async () => {
                return aggregate;
            })
            .withSaveAggregate(async (board: BoardAggregate) => {
                aggregateExpected = board;
                return board;
            })
            .build();

        const useCase = new AddListToBoardUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors).toBe(null);
        expect(aggregateExpected).not.toBe(null);

        expect(presenter.response?.list).not.toBe(null);
        expect(presenter.response?.list?.position).toBe(4);
    });

    it('should set the position of the new list 0 if there is no list in the board', async () => {
        // Given
        let aggregateExpected: BoardAggregate | null = null;

        const aggregate = new BoardAggregateBuilder()
            .withBoardId(BOARD_ID)
            .withName('Dev Challenge Boards')
            .withIsPrivate(true)
            .withLists([])
            .withParticipants([
                {
                    isAdmin: true,
                    member: admin
                }
            ])
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return aggregate;
            })
            .withSaveAggregate(async (board: BoardAggregate) => {
                aggregateExpected = board;
                return board;
            })
            .build();

        const useCase = new AddListToBoardUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors).toBe(null);
        expect(aggregateExpected).not.toBe(null);

        expect(presenter.response?.list).not.toBe(null);
        expect(presenter.response?.list?.position).toBe(0);
    });

    it('Should show error if board is inexistant', async () => {
        // Given
        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return null;
            })
            .build();

        const useCase = new AddListToBoardUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response?.errors).not.toBe(null);
        expect(presenter.response?.errors?.boardId).toContainEqual(
            "Ce tableau n'existe pas"
        );
    });

    it('Should show error if requester is not a participant of the board', async () => {
        // Given
        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return aggregate;
            })
            .build();

        const useCase = new AddListToBoardUseCase(boardAggregateRepository);

        // When
        await useCase.execute(
            { ...request, requesterId: 'otherId' },
            presenter
        );

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors).not.toBe(null);
        expect(presenter.response?.errors?.requesterId).toContainEqual(
            "Vous n'êtes pas membre de ce tableau"
        );
    });

    describe('Invalid Requests', () => {
        const dataset: { label: string; request: AddListToBoardRequest }[] = [
            {
                label: 'Name empty',
                request: {
                    ...request,
                    name: ''
                }
            },
            {
                label: 'boardId empty',
                request: {
                    ...request,
                    boardId: ''
                }
            },
            {
                label: 'requesterId empty',
                request: {
                    ...request,
                    requesterId: ''
                }
            }
        ];

        it.each(dataset)(
            'shows errors with invalid request : "$label"',
            async ({ request }) => {
                // Given
                const boardAggregateRepository =
                    new BoardAggregateRepositoryBuilder()
                        .withGetBoardAggregateById(async () => {
                            return aggregate;
                        })
                        .build();
                const useCase = new AddListToBoardUseCase(
                    boardAggregateRepository
                );

                // When
                await useCase.execute(request, presenter);

                // Then
                expect(presenter.response?.errors).not.toBe(null);
            }
        );
    });
});
