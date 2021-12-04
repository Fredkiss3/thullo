import {
    BoardAggregate,
    InviteMemberToBoardPresenter,
    InviteMemberToBoardRequest,
    InviteMemberToBoardResponse,
    InviteMemberToBoardUseCase,
    Member,
    MemberRepository
} from '@thullo/domain';
import { v4 as uuidv4 } from 'uuid';
import { BoardAggregateRepositoryBuilder } from '../builder/BoardAggregateRepositoryBuilder';
import { MemberRepositoryBuilder } from '../builder/MemberRepositoryBuilder';

const presenter = new (class implements InviteMemberToBoardPresenter {
    response?: InviteMemberToBoardResponse | null;

    present(response: InviteMemberToBoardResponse): void {
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

const memberToAdd: Member = {
    id: uuidv4(),
    login: 'poseidon',
    name: 'Poseidon God of the sea',
    avatarURL: 'https://www.photos.com/poseidon.png'
};

const request: InviteMemberToBoardRequest = {
    memberId: memberToAdd.id,
    initiatorId: admin.id,
    boardId: BOARD_ID
};

describe('InviteMemberToBoard Use case', () => {
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

        let boardExpected: BoardAggregate;
        const memberRepository: MemberRepository = new MemberRepositoryBuilder()
            .withGetMemberById(async (id) => {
                return memberToAdd;
            })
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return aggregate;
            })
            .withSave(async (boardAggregate) => {
                boardExpected = boardAggregate;
                return boardAggregate;
            })
            .build();

        const useCase = new InviteMemberToBoardUseCase(
            memberRepository,
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).toBe(null);

        expect(boardExpected!).not.toBeFalsy();
        expect(boardExpected!).toBe(aggregate);
        expect(boardExpected!.participants).toHaveLength(2);
        expect(boardExpected!.participants[1].member).toBe(memberToAdd);
    });

    it('should show errors if initiator is not a member of the board', async () => {
        // Given
        let boardExpected: BoardAggregate | null = null;
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
        const memberRepository: MemberRepository = new MemberRepositoryBuilder()
            .withGetMemberById(async (id) => {
                return memberToAdd;
            })
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return aggregate;
            })
            .withSave(async (boardAggregate) => {
                boardExpected = boardAggregate;
                return boardAggregate;
            })
            .build();

        const useCase = new InviteMemberToBoardUseCase(
            memberRepository,
            boardAggregateRepository
        );

        // When
        await useCase.execute(
            { ...request, initiatorId: memberToAdd.id },
            presenter
        );

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).not.toBe(null);
        expect(presenter.response!.errors!.initiatorId).toHaveLength(1);
        expect(boardExpected!).toBe(null);
    });

    it('Should show errors if member already present in board', async () => {
        // Given
        let boardExpected: BoardAggregate | null = null;
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
                        member: memberToAdd
                    }
                ]
            }
        );
        const memberRepository: MemberRepository = new MemberRepositoryBuilder()
            .withGetMemberById(async (id) => {
                return memberToAdd;
            })
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return aggregate;
            })
            .withSave(async (boardAggregate) => {
                boardExpected = boardAggregate;
                return boardAggregate;
            })
            .build();

        const useCase = new InviteMemberToBoardUseCase(
            memberRepository,
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).not.toBe(null);
        expect(presenter.response!.errors!.memberId).toHaveLength(1);
        expect(boardExpected!).toBe(null);
    });

    it('should show errors if member does not exist', async () => {
        // Given
        let boardExpected: BoardAggregate | null = null;
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
        const memberRepository: MemberRepository = new MemberRepositoryBuilder()
            .withGetMemberById(async (id) => {
                return null;
            })
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return aggregate;
            })
            .withSave(async (boardAggregate) => {
                boardExpected = boardAggregate;
                return boardAggregate;
            })
            .build();

        const useCase = new InviteMemberToBoardUseCase(
            memberRepository,
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).not.toBe(null);
        expect(presenter.response!.errors!.memberId).toHaveLength(1);
        expect(boardExpected!).toBe(null);
    });

    it('Should show errors if board does not exist', async () => {
        // Given
        let boardExpected: BoardAggregate | null = null;
        const memberRepository: MemberRepository = new MemberRepositoryBuilder()
            .withGetMemberById(async (id) => {
                return memberToAdd;
            })
            .build();

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return null;
            })
            .withSave(async (boardAggregate) => {
                boardExpected = boardAggregate;
                return boardAggregate;
            })
            .build();

        const useCase = new InviteMemberToBoardUseCase(
            memberRepository,
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).not.toBe(null);
        expect(presenter.response!.errors!.boardId).toHaveLength(1);
        expect(boardExpected!).toBe(null);
    });

    describe('Invalid Requests', () => {
        const dataset: {
            label: string;
            request: InviteMemberToBoardRequest;
        }[] = [
            {
                label: 'MemberId empty',
                request: {
                    ...request,
                    memberId: ''
                }
            },
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

                let boardExpected: BoardAggregate;
                const memberRepository: MemberRepository =
                    new MemberRepositoryBuilder()
                        .withGetMemberById(async (id) => {
                            return memberToAdd;
                        })
                        .build();

                const boardAggregateRepository =
                    new BoardAggregateRepositoryBuilder()
                        .withGetBoardAggregateById(async () => {
                            return aggregate;
                        })
                        .withSave(async (boardAggregate) => {
                            boardExpected = boardAggregate;
                            return boardAggregate;
                        })
                        .build();

                const useCase = new InviteMemberToBoardUseCase(
                    memberRepository,
                    boardAggregateRepository
                );

                // When
                await useCase.execute(request, presenter);

                // Then
                expect(presenter.response!.errors).not.toBeNull();
            }
        );
    });
});
