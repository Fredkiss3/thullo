import {
    ChangeBoardNameRequest,
    ChangeBoardNameUseCase,
    ChangeBoardNamePresenter,
    ChangeBoardNameResponse,
    Member,
    BoardAggregate
} from '@thullo/domain';
import { v4 as uuidv4 } from 'uuid';
import { BoardAggregateRepositoryBuilder } from '../builder/BoardAggregateRepositoryBuilder';
import { MemberRepositoryBuilder } from '../builder/MemberRepositoryBuilder';

const presenter = new (class implements ChangeBoardNamePresenter {
    response?: ChangeBoardNameResponse | null;

    present(response: ChangeBoardNameResponse): void {
        this.response = response;
    }
})();

const admin: Member = {
    id: uuidv4(),
    login: 'zeus',
    name: 'Zeus God of thunder',
    avatarURL: 'https://www.photos.com/thunder.png'
};

const BOARD_ID = uuidv4();

const request: ChangeBoardNameRequest = {
    boardId: BOARD_ID,
    requesterId: admin.id,
    name: 'Olympus Meeting'
};

describe('ChangeBoardName Use case', () => {
    it('is successful', async () => {
        // Given
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

        let expectedAggregate: BoardAggregate;

        const memberRepository = new MemberRepositoryBuilder()
            .withGetMemberById(async () => {
                return admin;
            })
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return aggregate;
            })
            .withSave(async (aggregate) => {
                expectedAggregate = aggregate;
                return aggregate;
            })
            .build();

        const useCase = new ChangeBoardNameUseCase(
            memberRepository,
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(expectedAggregate!).not.toBe(undefined);
        expect(expectedAggregate!.name).toBe(request.name);
    });

    it('should show errors if requester is not an admin of the board', async () => {
        // Given
        const otherParticipant: Member = {
            id: uuidv4(),
            login: 'poseidon',
            name: 'Poseidon God of the sea',
            avatarURL: 'https://www.photos.com/poseidon.png'
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
                    },
                    {
                        isAdmin: false,
                        member: otherParticipant
                    }
                ]
            }
        );

        const memberRepository = new MemberRepositoryBuilder()
            .withGetMemberById(async () => {
                return otherParticipant;
            })
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return aggregate;
            })
            .build();

        const useCase = new ChangeBoardNameUseCase(
            memberRepository,
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).not.toBe(null);
        expect(presenter.response!.errors!.requesterId).toHaveLength(1);
    });

    it('should show error if user does not exists', async () => {
        // Given
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

        const memberRepository = new MemberRepositoryBuilder()
            .withGetMemberById(async () => {
                return null;
            })
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return aggregate;
            })
            .build();

        const useCase = new ChangeBoardNameUseCase(
            memberRepository,
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response!.errors).not.toBe(null);
        expect(presenter.response!.errors!.requesterId).toHaveLength(1);
    });

    it('should show error if board does not exists', async () => {
        // Given
        const memberRepository = new MemberRepositoryBuilder()
            .withGetMemberById(async () => {
                return admin;
            })
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return null;
            })
            .build();

        const useCase = new ChangeBoardNameUseCase(
            memberRepository,
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response!.errors).not.toBe(null);
        expect(presenter.response!.errors!.boardId).toHaveLength(1);
    });

    describe('Invalid Requests', () => {
        const dataset: { label: string; request: ChangeBoardNameRequest }[] = [
            {
                label: 'Empty boardId',
                request: {
                    ...request,
                    boardId: ''
                }
            },
            {
                label: 'Empty name',
                request: {
                    ...request,
                    name: ''
                }
            },
            {
                label: 'Empty requesterId',
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

                const memberRepository = new MemberRepositoryBuilder()
                    .withGetMemberById(async () => {
                        return admin;
                    })
                    .build();

                const boardAggregateRepository =
                    new BoardAggregateRepositoryBuilder()
                        .withGetBoardAggregateById(async () => {
                            return aggregate;
                        })
                        .build();

                const useCase = new ChangeBoardNameUseCase(
                    memberRepository,
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
