import {
    RemoveMemberFromBoardRequest,
    RemoveMemberFromBoardUseCase,
    RemoveMemberFromBoardPresenter,
    RemoveMemberFromBoardResponse,
    BoardAggregateBuilder,
    Member,
    MemberRepository,
    BoardAggregate
} from '@thullo/domain';
import { v4 as uuidv4 } from 'uuid';
import { MemberRepositoryBuilder } from '../builder/MemberRepositoryBuilder';
import { BoardAggregateRepositoryBuilder } from '../builder/BoardAggregateRepositoryBuilder';

const presenter = new (class implements RemoveMemberFromBoardPresenter {
    response?: RemoveMemberFromBoardResponse | null;

    present(response: RemoveMemberFromBoardResponse): void {
        this.response = response;
    }
})();

const BOARD_ID = uuidv4();

const admin: Member = {
    id: uuidv4(),
    login: 'zeus',
    name: 'Zeus God of thunder',
    avatarURL: 'https://www.picsum.photos/seed/zeus/200/300'
};

const otherMember: Member = {
    id: uuidv4(),
    login: 'poseidon',
    name: 'Poseidon God of the sea',
    avatarURL: 'https://www.picsum.photos/seed/poseidon/200/300'
};

const request: RemoveMemberFromBoardRequest = {
    memberId: otherMember.id,
    initiatorId: admin.id,
    boardId: BOARD_ID
};

describe('RemoveMemberFromBoard Use case', () => {
    it('is successful', async () => {
        // Given
        const aggregate = new BoardAggregateBuilder()
            .withBoardId(BOARD_ID)
            .withParticipants([
                {
                    isAdmin: true,
                    member: admin
                },
                {
                    isAdmin: false,
                    member: otherMember
                }
            ])
            .build();

        const memberRepository: MemberRepository = new MemberRepositoryBuilder()
            .withGetMemberById(async (id) => {
                return otherMember;
            })
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

        const useCase = new RemoveMemberFromBoardUseCase(
            memberRepository,
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).toBe(null);
        expect(boardExpected!).not.toBeFalsy();
        expect(boardExpected!.participants.length).toBe(1);
        expect(boardExpected!).toBe(presenter.response!.aggregate);
    });

    it('should show errors if initiator is not an admin of the board', async () => {
        // Given
        const aggregate = new BoardAggregateBuilder()
            .withBoardId(BOARD_ID)
            .withParticipants([
                {
                    isAdmin: false,
                    member: admin
                },
                {
                    isAdmin: false,
                    member: otherMember
                }
            ])
            .build();

        const memberRepository: MemberRepository = new MemberRepositoryBuilder()
            .withGetMemberById(async (id) => {
                return otherMember;
            })
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

        const useCase = new RemoveMemberFromBoardUseCase(
            memberRepository,
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).not.toBe(null);
        expect(presenter.response!.errors!.initiatorId).toHaveLength(1);
        expect(boardExpected!).toBeFalsy();
        expect(presenter.response!.aggregate).toBeNull();
    });

    it('should show errors if board does not exists', async () => {
        // Given
        const memberRepository: MemberRepository = new MemberRepositoryBuilder()
            .withGetMemberById(async (id) => {
                return otherMember;
            })
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return null;
            })
            .build();

        const useCase = new RemoveMemberFromBoardUseCase(
            memberRepository,
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).not.toBe(null);
        expect(presenter.response!.errors!.boardId).toHaveLength(1);
        expect(presenter.response!.aggregate).toBeNull();
    });

    it('should show errors if member is not a participant of the board', async () => {
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

        const memberRepository: MemberRepository = new MemberRepositoryBuilder()
            .withGetMemberById(async (id) => {
                return otherMember;
            })
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return aggregate;
            })
            .build();

        const useCase = new RemoveMemberFromBoardUseCase(
            memberRepository,
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).not.toBe(null);
        expect(presenter.response!.errors!.memberId).toHaveLength(1);
        expect(presenter.response!.aggregate).toBeNull();
    });

    it('should show errors if memberId does not exists', async () => {
        // Given
        const aggregate = new BoardAggregateBuilder()
            .withBoardId(BOARD_ID)
            .withParticipants([
                {
                    isAdmin: true,
                    member: admin
                },
                {
                    isAdmin: false,
                    member: otherMember
                }
            ])
            .build();

        const memberRepository: MemberRepository = new MemberRepositoryBuilder()
            .withGetMemberById(async (id) => {
                return null;
            })
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return aggregate;
            })
            .build();

        const useCase = new RemoveMemberFromBoardUseCase(
            memberRepository,
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).not.toBe(null);
        expect(presenter.response!.errors!.memberId).toHaveLength(1);
        expect(presenter.response!.aggregate).toBeNull();
    });

    describe('Invalid Requests', () => {
        const dataset: {
            label: string;
            request: RemoveMemberFromBoardRequest;
        }[] = [
            {
                label: 'Empty boardId',
                request: {
                    ...request,
                    boardId: ''
                }
            },
            {
                label: 'Empty memberId',
                request: {
                    ...request,
                    memberId: ''
                }
            },
            {
                label: 'Empty initiatorId',
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
                        },
                        {
                            isAdmin: false,
                            member: otherMember
                        }
                    ])
                    .build();

                const memberRepository: MemberRepository =
                    new MemberRepositoryBuilder()
                        .withGetMemberById(async (id) => {
                            return otherMember;
                        })
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

                const useCase = new RemoveMemberFromBoardUseCase(
                    memberRepository,
                    boardAggregateRepository
                );

                // When
                await useCase.execute(request, presenter);

                // Then
                expect(presenter.response).not.toBe(null);
                expect(presenter.response!.errors).not.toBe(null);
                expect(boardExpected!).toBeFalsy();
                expect(presenter.response!.aggregate).toBeNull();
            }
        );
    });
});
