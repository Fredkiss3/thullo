import {
    SeeCardDetailsRequest,
    SeeCardDetailsUseCase,
    SeeCardDetailsPresenter,
    SeeCardDetailsResponse,
    Member,
    BoardAggregate,
    BoardAggregateBuilder,
    Card
} from '../../src';
import { v4 as uuidv4 } from 'uuid';
import { BoardAggregateRepositoryBuilder } from '../builder/BoardAggregateRepositoryBuilder';

const presenter = new (class implements SeeCardDetailsPresenter {
    response?: SeeCardDetailsResponse | null;

    present(response: SeeCardDetailsResponse): void {
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

const request: SeeCardDetailsRequest = {
    boardId: BOARD_ID,
    requestedBy: admin.id,
    cardId
};

describe('SeeCardDetails Use case', () => {
    it('is successful', async () => {
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
            .build();

        const useCase = new SeeCardDetailsUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.card).toStrictEqual(cardDetails);
    });

    it('should work if the board is public and no user has been passed', async () => {
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
            .build();

        const useCase = new SeeCardDetailsUseCase(boardAggregateRepository);

        // When
        await useCase.execute({
            ...request,
            requestedBy: null
        }, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.card).toStrictEqual(cardDetails);
    });

    it('should show error if the board is private and the user is not a participant of the board', async () => {
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
            .withIsPrivate(true)
            .withCards([cardDetails])
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(() => Promise.resolve(aggregate))
            .build();

        const useCase = new SeeCardDetailsUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.card).toBeNull();
        expect(presenter.response?.errors?.requestedBy).toHaveLength(1);
    });

    it('should show error if the board does not exists', async () => {
        // Given
        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(() => Promise.resolve(null))
            .build();

        const useCase = new SeeCardDetailsUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.card).toBeNull();
        expect(presenter.response?.errors?.boardId).toHaveLength(1);
    });

    it('should show error if the card does not exists', async () => {
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
            .withCards([])
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(() => Promise.resolve(aggregate))
            .build();

        const useCase = new SeeCardDetailsUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.card).toBeNull();
        expect(presenter.response?.errors?.cardId).toHaveLength(1);
    });

    describe('Invalid Requests', () => {
        const dataset: { label: string; request: SeeCardDetailsRequest }[] = [
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
                    .build();

                const useCase = new SeeCardDetailsUseCase(boardAggregateRepository);

                // When
                await useCase.execute(request, presenter);

                // Then
                expect(presenter.response).not.toBe(null);
                expect(presenter.response?.card).toBeNull();
            }
        );
    });
});
