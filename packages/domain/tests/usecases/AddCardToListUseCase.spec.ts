import {
    AddCardToListRequest,
    AddCardToListUseCase,
    AddCardToListPresenter,
    AddCardToListResponse,
    BoardAggregate,
    List,
    Member
} from '@thullo/domain';
import { v4 as uuidv4 } from 'uuid';
import { BoardAggregateRepositoryBuilder } from '../builder/BoardAggregateRepositoryBuilder';

const presenter = new (class implements AddCardToListPresenter {
    response?: AddCardToListResponse | null;

    present(response: AddCardToListResponse): void {
        this.response = response;
    }
})();

const BOARD_ID = uuidv4();
const list: List = {
    id: uuidv4(),
    name: 'To Do',
    boardId: BOARD_ID,
    position: 0
};

const admin: Member = {
    id: uuidv4(),
    login: 'zeus',
    name: 'Zeus God of thunder',
    avatarURL: 'https://www.photos.com/thunder.png'
};

const other: Member = {
    ...admin,
    id: uuidv4()
};

const request: AddCardToListRequest = {
    requesterId: admin.id,
    boardId: BOARD_ID,
    listId: list.id,
    title: 'New Card'
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
            lists: [list],
            participants: [
                {
                    isAdmin: true,
                    member: admin
                }
            ]
        }
    );
};

describe('AddCardToList Use case', () => {
    beforeEach(initTests);

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

        const useCase = new AddCardToListUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected).not.toBe(null);

        const cards = aggregateExpected!.cardsByLists[list.id];

        expect(cards).toHaveLength(1);
        expect(cards[0].title).toBe('New Card');
    });

    it('Should show error if board does not exists', async () => {
        // Given
        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return null;
            })
            .build();

        const useCase = new AddCardToListUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors).not.toBe(null);
        expect(presenter.response?.errors?.boardId).toContainEqual(
            "Ce tableau n'existe pas"
        );
    });

    it('Should show error if list does not exists', async () => {
        // Given
        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return aggregate;
            })
            .build();

        const useCase = new AddCardToListUseCase(boardAggregateRepository);

        // When
        await useCase.execute({ ...request, listId: 'inexistant' }, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors).not.toBe(null);
        expect(presenter.response?.errors?.listId).toHaveLength(1);
    });

    it('Should show error if requester is not a participant of the board', async () => {
        // Given
        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return aggregate;
            })
            .build();

        const useCase = new AddCardToListUseCase(boardAggregateRepository);

        // When
        await useCase.execute({ ...request, requesterId: other.id }, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors).not.toBe(null);
        expect(presenter.response?.errors?.requesterId).toContainEqual(
            "Vous n'êtes pas membre de ce tableau"
        );
    });

    describe('Invalid Requests', () => {
        const dataset: { label: string; request: AddCardToListRequest }[] = [
            {
                label: 'Empty listId',
                request: {
                    ...request,
                    listId: ''
                }
            },
            {
                label: 'Empty title',
                request: {
                    ...request,
                    title: ''
                }
            },
            {
                label: 'Empty requesterId',
                request: {
                    ...request,
                    requesterId: ''
                }
            },
            {
                label: 'Empty boardId',
                request: {
                    ...request,
                    boardId: ''
                }
            }
        ];

        it.each(dataset)(
            'shows errors with invalid request : "$label"',
            async ({ request }) => {
                // // Given
                // Given
                const boardAggregateRepository =
                    new BoardAggregateRepositoryBuilder()
                        .withGetBoardAggregateById(async () => {
                            return aggregate;
                        })
                        .build();

                const useCase = new AddCardToListUseCase(
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
