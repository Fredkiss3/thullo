import {
    AddLabelToCardRequest,
    AddLabelToCardUseCase,
    AddLabelToCardPresenter,
    AddLabelToCardResponse,
    Card,
    Member,
    BoardAggregate,
    BoardAggregateBuilder,
    Colors
} from '../../src';
import { v4 as uuidv4 } from 'uuid';
import { BoardAggregateRepositoryBuilder } from '../builder/BoardAggregateRepositoryBuilder';

const presenter = new (class implements AddLabelToCardPresenter {
    response?: AddLabelToCardResponse | null;

    present(response: AddLabelToCardResponse): void {
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

const request: AddLabelToCardRequest = {
    boardId: BOARD_ID,
    labelId: null,
    cardId,
    requestedBy: admin.id,
    color: Colors.BLUE,
    name: 'New label'
};

describe('AddLabelToCard Use case', () => {
    it('should add the label to the card and to the board if no id is passed', async () => {
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

        const useCase = new AddLabelToCardUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected!).not.toBeFalsy();

        // added to the board
        expect(Object.values(aggregateExpected!.labelsByIds)).toHaveLength(1);
        expect(Object.values(aggregateExpected!.labelsByIds)[0].name).toBe(
            'New label'
        );

        // added to the card
        expect(aggregateExpected!.getCardById(cardId).labels).toHaveLength(1);
        expect(aggregateExpected!.getCardById(cardId).labels[0].name).toBe(
            'New label'
        );
    });

    it('should add the label to the card and not to the board if an id is passed', async () => {
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
            .withLabels([
                {
                    name: 'Label 1',
                    color: Colors.BLUE,
                    id: labelID
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
            .withSaveAggregate((aggregate) => {
                aggregateExpected = aggregate;
                return Promise.resolve(aggregate);
            })
            .build();

        const useCase = new AddLabelToCardUseCase(boardAggregateRepository);

        // When
        const { name, ...requestRest } = request; // remove the name
        await useCase.execute(
            {
                ...requestRest,
                labelId: labelID
            },
            presenter
        );

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected!).not.toBeFalsy();

        // Not added to the board
        expect(Object.values(aggregateExpected!.labelsByIds)).toHaveLength(1);
        expect(Object.values(aggregateExpected!.labelsByIds)[0].name).toBe(
            'Label 1'
        );

        expect(aggregateExpected!.getCardById(cardId).labels).toHaveLength(1);
        expect(aggregateExpected!.getCardById(cardId).labels[0].name).toBe(
            'Label 1'
        );
    });

    it('should show error if the label does not exist', async () => {
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

        const useCase = new AddLabelToCardUseCase(boardAggregateRepository);

        // When
        const { name, ...requestRest } = request; // remove the name
        await useCase.execute(
            {
                ...requestRest,
                labelId: labelID
            },
            presenter
        );

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected!).toBeNull();
        expect(presenter.response!.errors?.labelId).toHaveLength(1);
    });

    it('should show error if the card does not exist', async () => {
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

        const useCase = new AddLabelToCardUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected!).toBeNull();
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

        const useCase = new AddLabelToCardUseCase(boardAggregateRepository);

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

        const useCase = new AddLabelToCardUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(aggregateExpected!).toBeNull();
        expect(presenter.response!.errors?.requestedBy).toHaveLength(1);
    });

    describe('Invalid Requests', () => {
        const dataset: { label: string; request: AddLabelToCardRequest }[] = [
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
                label: 'Empty member id',
                request: {
                    ...request,
                    requestedBy: ''
                }
            },
            {
                label: 'Invalid color',
                request: {
                    ...request,
                    // @ts-ignore
                    color: 'invalid'
                }
            },
            {
                label: 'Name and labelId are not provided',
                request: {
                    ...request,
                    name: null,
                    labelId: null
                }
            },
            {
                label: 'Name is provided but color is not',
                request: {
                    ...request,
                    name: 'Label 1',
                    color: null
                }
            },
            {
                label: 'Empty name and not labelId',
                request: {
                    ...request,
                    name: '',
                    labelId: null
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

                const useCase = new AddLabelToCardUseCase(
                    boardAggregateRepository
                );

                // When
                await useCase.execute(request, presenter);

                // Then
                expect(presenter.response).not.toBe(null);
                expect(aggregateExpected!).toBeNull();

                // Then
                expect(presenter.response!.errors).not.toBe(null);
            }
        );
    });
});
