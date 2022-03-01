import {
    SetBoardVisibilityRequest,
    SetBoardVisibilityUseCase,
    SetBoardVisibilityPresenter,
    SetBoardVisibilityResponse,
    BoardAggregate
} from '@thullo/domain';
import { v4 as uuidv4 } from 'uuid';
import { BoardAggregateRepositoryBuilder } from '../builder/BoardAggregateRepositoryBuilder';

const presenter = new (class implements SetBoardVisibilityPresenter {
    response?: SetBoardVisibilityResponse | null;

    present(response: SetBoardVisibilityResponse): void {
        this.response = response;
    }
})();

const admin = {
    id: uuidv4(),
    login: 'zeus',
    password: '$2a$12$wAw/.WVPaDZXyFT7FIfkGOrCAYTfHPrgXLd7ABu8WBl6.ResQDvSq', // "password123."
    name: 'Zeus God of thunder',
    avatarURL: 'https://www.photos.com/thunder.png'
};

const BOARD_ID = uuidv4();

const request: SetBoardVisibilityRequest = {
    boardId: BOARD_ID,
    private: false,
    requesterId: admin.id
};

let aggregate: BoardAggregate;

const initTests = () => {
    aggregate = new BoardAggregate(
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

    presenter.response = null;
};

describe('SetBoardVisibility Use case', () => {
    beforeEach(initTests);

    it('is successful', async () => {
        // Given
        let aggregateExpected: BoardAggregate | null = null;

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return aggregate;
            })
            .withSaveAggregate(async (board) => {
                aggregateExpected = board;
                return board;
            })
            .build();

        const useCase = new SetBoardVisibilityUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(aggregateExpected).not.toBe(null);
        expect(aggregateExpected!.isPrivate).toBe(false);
        expect(aggregateExpected).toBe(presenter.response!.board);
    });

    it('Show errors if operation resulted in an error', async () => {
        // Given
        let aggregateExpected: BoardAggregate | null = null;

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return aggregate;
            })
            .withSaveAggregate(async (board) => {
                aggregateExpected = board;
                return board;
            })
            .build();

        const useCase = new SetBoardVisibilityUseCase(boardAggregateRepository);

        // When
        await useCase.execute({ ...request, requesterId: 'id' }, presenter);

        // Then
        expect(aggregateExpected).toBe(null);
        expect(presenter.response?.errors).not.toBe(null);
        expect(presenter.response?.errors!.requesterId).toHaveLength(1);
        expect(presenter.response!.board).toBe(null);
    });

    it('Should show errors if board does not exists', async () => {
        // Given
        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return null;
            })
            .build();

        // When
        const useCase = new SetBoardVisibilityUseCase(boardAggregateRepository);
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response?.errors).not.toBe(null);
        expect(presenter.response?.errors!.boardId).toHaveLength(1);
        expect(presenter.response!.board).toBe(null);
    });

    describe('Invalid Requests', () => {
        const dataset: { label: string; request: SetBoardVisibilityRequest }[] =
            [
                {
                    label: 'empty Board Id',
                    request: {
                        ...request,
                        boardId: ''
                    }
                },
                {
                    label: 'empty requesterId',
                    request: {
                        ...request,
                        requesterId: ''
                    }
                }
            ];

        it.each(dataset)(
            'show errors with invalid request : "$label"',
            async ({ request }) => {
                // // Given
                const boardAggregateRepository =
                    new BoardAggregateRepositoryBuilder()
                        .withGetBoardAggregateById(async () => {
                            return aggregate;
                        })
                        .build();
                const useCase = new SetBoardVisibilityUseCase(
                    boardAggregateRepository
                );
                // When
                await useCase.execute(request, presenter);

                // Then
                expect(presenter.response?.errors).not.toBe(null);
                expect(presenter.response!.board).toBe(null);
            }
        );
    });
});
