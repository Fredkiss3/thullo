import {
    SeeBoardDetailsRequest,
    SeeBoardDetailsUseCase,
    SeeBoardDetailsPresenter,
    SeeBoardDetailsResponse,
    BoardAggregate,
    BoardAggregateBuilder,
    Member
} from '@thullo/domain';
import { BoardAggregateRepositoryBuilder } from '../builder/BoardAggregateRepositoryBuilder';
import { v4 as uuidv4 } from 'uuid';
import { MemberRepositoryBuilder } from '../builder/MemberRepositoryBuilder';

const presenter = new (class implements SeeBoardDetailsPresenter {
    response?: SeeBoardDetailsResponse | null;

    present(response: SeeBoardDetailsResponse): void {
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

const request: SeeBoardDetailsRequest = {
    boardId: BOARD_ID,
    requesterId: admin.id
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

describe('SeeBoardDetails Use case', () => {
    it('is successful', async () => {
        // Given
        const memberRepository = new MemberRepositoryBuilder()
            .withGetMemberById(async () => {
                return admin;
            })
            .build();
        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return aggregate;
            })
            .build();

        const useCase = new SeeBoardDetailsUseCase(
            memberRepository,
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.aggregate).toBe(aggregate);
    });

    it('is successful with no member', async () => {
        // Given
        const memberRepository = new MemberRepositoryBuilder().build();

        const aggregateExpected = new BoardAggregateBuilder()
            .withBoardId(BOARD_ID)
            .withName('Dev Challenge Boards')
            .withDescription('')
            .withIsPrivate(false)
            .withParticipants([
                {
                    isAdmin: true,
                    member: admin
                }
            ])
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return aggregateExpected;
            })
            .build();

        const useCase = new SeeBoardDetailsUseCase(
            memberRepository,
            boardAggregateRepository
        );

        // When
        await useCase.execute({ boardId: BOARD_ID }, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).toBe(null);
        expect(presenter.response!.aggregate).toBe(aggregateExpected);
    });

    it('Should show errors if board does not exists', async () => {
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

        const useCase = new SeeBoardDetailsUseCase(
            memberRepository,
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors?.boardId).toHaveLength(1);
    });

    it('should show errors if the requester is not a participant of the board', async () => {
        // Given
        const nonParticipantMember: Member = {
            id: uuidv4(),
            login: 'poseidon',
            name: 'Poseidon God of the sea',
            avatarURL: 'https://www.photos.com/poseidon.png'
        };

        const memberRepository = new MemberRepositoryBuilder()
            .withGetMemberById(async () => {
                return nonParticipantMember;
            })
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return aggregate;
            })
            .build();

        const useCase = new SeeBoardDetailsUseCase(
            memberRepository,
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).not.toBe(null);
        expect(presenter.response!.errors!.requesterId).toHaveLength(1);
        expect(presenter.response!.aggregate).toBe(null);
    });

    it('should show be ok if the board is public and the user is not a participant of the board', async () => {
        // Given
        const nonParticipantMember: Member = {
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
                private: false
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
                return nonParticipantMember;
            })
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return aggregate;
            })
            .build();

        const useCase = new SeeBoardDetailsUseCase(
            memberRepository,
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).toBe(null);
        expect(presenter.response!.aggregate).toBe(aggregate);
    });

    it('should show error if member does not exists', async () => {
        // Given
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

        const useCase = new SeeBoardDetailsUseCase(
            memberRepository,
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).not.toBe(null);
        expect(presenter.response!.errors!.requesterId).toHaveLength(1);
        expect(presenter.response!.aggregate).toBe(null);
    });

    describe('Invalid Requests', () => {
        const dataset: { label: string; request: SeeBoardDetailsRequest }[] = [
            {
                label: 'No boardId provided',
                request: {
                    ...request,
                    boardId: ''
                }
            }
        ];

        it.each(dataset)(
            'shows errors with invalid request : "$label"',
            async ({ request }) => {
                // Given
                const memberRepository = new MemberRepositoryBuilder()
                    .withGetMemberById(async () => {
                        return admin;
                    })
                    .build();
                const boardAggregateRepository =
                    new BoardAggregateRepositoryBuilder()
                        .withGetBoardAggregateById(async (id) => {
                            return aggregate;
                        })
                        .build();
                const useCase = new SeeBoardDetailsUseCase(
                    memberRepository,
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
