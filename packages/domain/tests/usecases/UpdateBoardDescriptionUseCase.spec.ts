import {
    BoardAggregate,
    BoardAggregateBuilder,
    Member,
    UpdateBoardDescriptionPresenter,
    UpdateBoardDescriptionRequest,
    UpdateBoardDescriptionResponse,
    UpdateBoardDescriptionUseCase
} from '@thullo/domain';
import { v4 as uuidv4 } from 'uuid';
import { BoardAggregateRepositoryBuilder } from '../builder/BoardAggregateRepositoryBuilder';

const presenter = new (class implements UpdateBoardDescriptionPresenter {
    response?: UpdateBoardDescriptionResponse | null;

    present(response: UpdateBoardDescriptionResponse): void {
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

const request: UpdateBoardDescriptionRequest = {
    boardId: BOARD_ID,
    description: 'New description',
    initiatorId: admin.id
};

describe('UpdateBoardDescription Use case', () => {
    it('is successful', async () => {
        // Given
        const aggregate = new BoardAggregateBuilder()
            .withBoardId(BOARD_ID)
            .withParticipants([
                {
                    isAdmin: true,
                    member: admin
                }
            ])
            .build();
        let boardExpected: BoardAggregate;

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return aggregate;
            })
            .withSaveAggregate(async (boardAggregate) => {
                boardExpected = boardAggregate;
                return boardAggregate;
            })
            .build();

        const useCase = new UpdateBoardDescriptionUseCase(
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).toBe(null);

        expect(boardExpected!).not.toBeFalsy();
        expect(boardExpected!).toBe(aggregate);
        expect(boardExpected!.description).toBe(request.description);
    });

    it('Should show errors if initiator is not an admin of the board', async () => {
        // Given
        const aggregate: BoardAggregate = new BoardAggregateBuilder()
            .withBoardId(BOARD_ID)
            .withParticipants([
                {
                    isAdmin: false,
                    member: admin
                }
            ])
            .build();

        let boardExpected: BoardAggregate;

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return aggregate;
            })
            .withSaveAggregate(async (boardAggregate) => {
                boardExpected = boardAggregate;
                return boardAggregate;
            })
            .build();

        const useCase = new UpdateBoardDescriptionUseCase(
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).not.toBe(null);
        expect(presenter.response!.errors!.initiatorId).toHaveLength(1);
        expect(boardExpected!).toBeFalsy();
    });

    it('Should show errors if board does not exist', async () => {
        // Given
        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return null;
            })
            .build();

        const useCase = new UpdateBoardDescriptionUseCase(
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).not.toBe(null);
        expect(presenter.response!.errors!.boardId).toHaveLength(1);
    });

    describe('Invalid Requests', () => {
        const dataset: {
            label: string;
            request: UpdateBoardDescriptionRequest;
        }[] = [
            {
                label: 'BoardId empty',
                request: {
                    ...request,
                    boardId: ''
                }
            },
            {
                label: 'initiatorId empty',
                request: {
                    ...request,
                    initiatorId: ''
                }
            }
        ];

        it.each(dataset)(
            'shows errors with invalid request : "$label"',
            async ({ request }) => {
                // Given
                const aggregate = new BoardAggregateBuilder()
                    .withBoardId(BOARD_ID)
                    .withParticipants([
                        {
                            isAdmin: true,
                            member: admin
                        }
                    ])
                    .build();
                let boardExpected: BoardAggregate;

                const boardAggregateRepository =
                    new BoardAggregateRepositoryBuilder()
                        .withGetBoardAggregateById(async () => {
                            return aggregate;
                        })
                        .withSaveAggregate(async (boardAggregate) => {
                            boardExpected = boardAggregate;
                            return boardAggregate;
                        })
                        .build();

                const useCase = new UpdateBoardDescriptionUseCase(
                    boardAggregateRepository
                );

                // When
                await useCase.execute(request, presenter);

                // Then
                expect(presenter.response!.errors).not.toBe(null);
            }
        );
    });
});
