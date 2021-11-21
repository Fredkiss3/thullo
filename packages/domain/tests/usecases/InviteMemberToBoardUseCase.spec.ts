import {
    InviteMemberToBoardRequest,
    InviteMemberToBoardUseCase,
    InviteMemberToBoardPresenter,
    InviteMemberToBoardResponse,
    BoardAggregate,
    Member
} from '@thullo/domain';
import { v4 as uuidv4 } from 'uuid';
import { MemberRepositoryBuilder } from '../builder/MemberRepositoryBuilder';
import { BoardAggregateRepositoryBuilder } from '../builder/BoardAggregateRepositoryBuilder';

const presenter = new (class implements InviteMemberToBoardPresenter {
    response?: InviteMemberToBoardResponse | null;

    present(response: InviteMemberToBoardResponse): void {
        this.response = response;
    }
})();

const admin: Member = {
    id: uuidv4(),
    login: 'zeus',
    password:
      '$2a$12$wAw/.WVPaDZXyFT7FIfkGOrCAYTfHPrgXLd7ABu8WBl6.ResQDvSq', // "password123."
    name: 'Zeus God of thunder',
    avatarURL: 'https://www.photos.com/thunder.png'
};

const BOARD_ID = uuidv4();

const request: InviteMemberToBoardRequest = {
    requesterId: admin.id,
    boardId: BOARD_ID,
    memberId: uuidv4()
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

        const expectedMember: Member = {
            id: request.memberId,
            login: 'poseidon',
            password:
                '$2a$12$wAw/.WVPaDZXyFT7FIfkGOrCAYTfHPrgXLd7ABu8WBl6.ResQDvSq', // "password123."
            name: 'Poseidon God of the sea',
            avatarURL: 'https://www.photos.com/poseidon.png'
        };

        let expectedAggregate: BoardAggregate | null = null;

        const memberRepository = new MemberRepositoryBuilder()
            .withGetMemberById(async () => {
                return expectedMember;
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

        const useCase = new InviteMemberToBoardUseCase(
            memberRepository,
            boardAggregateRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(expectedAggregate).not.toBe(null);
        expect(expectedAggregate!.participants.length).toBe(2);
        expect(expectedAggregate!.participants[1].member).toEqual(
            expectedMember
        );
    });

    it('Should show error if member is already present in board', async () => {
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

        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return aggregate;
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
        expect(aggregate.participants.length).toBe(1);
    });

    it('should show error if member does not exists', async () => {
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
    });

    it('should show error if aggregate does not exists', async () => {
        // Given
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
    });

    it("should show error if requesterId is not a participant of the board", async () => {
        // Given
        const nonParticipantMember: Member = {
            id: request.memberId,
            login: 'poseidon',
            password:
              '$2a$12$wAw/.WVPaDZXyFT7FIfkGOrCAYTfHPrgXLd7ABu8WBl6.ResQDvSq', // "password123."
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
                    }
                ]
            }
        );

        // Given
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

        const useCase = new InviteMemberToBoardUseCase(
            memberRepository,
            boardAggregateRepository
        );

        // When
        await useCase.execute({...request, requesterId: nonParticipantMember.id}, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).not.toBe(null);
        expect(presenter.response!.errors!.requesterId).toHaveLength(1);
    });

    describe('Invalid Requests', () => {
        const dataset: {
            label: string;
            request: InviteMemberToBoardRequest;
        }[] = [
            {
                label: 'empty board id',
                request: {
                    ...request,
                    boardId: ''
                }
            },
            {
                label: 'empty member id',
                request: {
                    ...request,
                    memberId: ''
                }
            },
            {
                label: 'empty requester id',
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
                      return {
                          id: request.memberId,
                          login: 'poseidon',
                          password:
                            '$2a$12$wAw/.WVPaDZXyFT7FIfkGOrCAYTfHPrgXLd7ABu8WBl6.ResQDvSq', // "password123."
                          name: 'Poseidon God of the sea',
                          avatarURL: 'https://www.photos.com/poseidon.png'
                      };
                  })
                  .build();

                const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
                  .withGetBoardAggregateById(async () => {
                      return aggregate;
                  })
                  .build();

                const useCase = new InviteMemberToBoardUseCase(
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
