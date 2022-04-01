import {
    RemoveLabelFromCardRequest,
    RemoveLabelFromCardUseCase,
    RemoveLabelFromCardPresenter,
    RemoveLabelFromCardResponse,
    Card,
    Label,
    Colors,
    Member,
    BoardAggregate,
    BoardAggregateBuilder
} from '../../src';
import { v4 as uuidv4 } from 'uuid';
import { BoardAggregateRepositoryBuilder } from '../builder/BoardAggregateRepositoryBuilder';

const presenter = new (class implements RemoveLabelFromCardPresenter {
    response?: RemoveLabelFromCardResponse | null;

    present(response: RemoveLabelFromCardResponse): void {
        this.response = response;
    }
})();

const BOARD_ID = uuidv4();
const cardId = uuidv4();
const todoListID = uuidv4();
const labelID = uuidv4();

const admin: Member = {
    id: uuidv4(),
    login: 'admin',
    name: 'admin',
    avatarURL: 'https://thispersondoesnotexist.com/image',
    email: 'admin@thullo.com'
};

const label: Label = {
    id: labelID,
    name: 'label',
    color: Colors.BLACK,
    parentBoardId: BOARD_ID
};

const cardDetails: Card = {
    id: cardId,
    title: 'Card title',
    description: 'Card description',
    parentListId: todoListID,
    labels: [label],
    comments: [],
    attachments: [],
    cover: null
};

const request: RemoveLabelFromCardRequest = {
    boardId: BOARD_ID,
    cardId,
    requestedBy: admin.id,
    labelId: labelID
};

describe('RemoveLabelFromCard Use case', () => {
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
            .withLabels([label])
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

        const useCase = new RemoveLabelFromCardUseCase(
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected!).not.toBeFalsy();

        expect(Object.values(aggregateExpected!.labelsByIds)).toHaveLength(1);
        expect(aggregateExpected!.getCardById(cardId).labels).toHaveLength(0);
    });

    it('should show error when label does not exist', async () => {
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
            .withLabels([])
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

        const useCase = new RemoveLabelFromCardUseCase(
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected).toBeNull();
        expect(presenter.response!.errors?.labelId).toHaveLength(1);
    });

    it('should show error when card does not exist', async () => {
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
            .withLabels([label])
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

        const useCase = new RemoveLabelFromCardUseCase(
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected).toBeNull();
        expect(presenter.response!.errors?.cardId).toHaveLength(1);
    });

    it('should show error if the board does not exist', async () => {
        // Given
        let aggregateExpected: BoardAggregate | null = null;

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(() => Promise.resolve(null))
            .withSaveAggregate((aggregate) => {
                aggregateExpected = aggregate;
                return Promise.resolve(aggregate);
            })
            .build();

        const useCase = new RemoveLabelFromCardUseCase(
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected!).toBeNull();
        expect(presenter.response!.errors?.boardId).toHaveLength(1);
    });

    it('show error if the requester is not a member of the board', async () => {
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
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(() => Promise.resolve(aggregate))
            .withSaveAggregate((aggregate) => {
                aggregateExpected = aggregate;
                return Promise.resolve(aggregate);
            })
            .build();

        const useCase = new RemoveLabelFromCardUseCase(
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected!).toBeNull();
        expect(presenter.response!.errors?.requestedBy).toHaveLength(1);
    });

    describe('Invalid Requests', () => {
        const dataset: {
            label: string;
            request: RemoveLabelFromCardRequest;
        }[] = [
            {
                label: 'Empty label id',
                request: {
                    ...request,
                    labelId: ''
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
                    .withLabels([label])
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

                const useCase = new RemoveLabelFromCardUseCase(
                    boardAggregateRepository
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
