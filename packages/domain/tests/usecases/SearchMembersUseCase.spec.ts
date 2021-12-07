import {
    SearchMembersRequest,
    SearchMembersUseCase,
    SearchMembersPresenter,
    SearchMembersResponse,
    MemberRepository,
    BoardRepository,
    Member
} from '@thullo/domain';
import { MemberRepositoryBuilder } from '../builder/MemberRepositoryBuilder';
import { v4 as uuidv4 } from 'uuid';
import { BoardRepositoryBuilder } from '../builder/BoardRepositoryBuilder';

const presenter = new (class implements SearchMembersPresenter {
    response?: SearchMembersResponse | null;

    present(response: SearchMembersResponse): void {
        this.response = response;
    }
})();

const request: SearchMembersRequest = {
    query: 'adam',
    boardId: uuidv4(),
    limit: 5
};

describe('SearchMembers Use case', () => {
    it('is successful', async () => {
        // Given
        const expectedResult: Member[] = [
            {
                id: uuidv4(),
                name: 'Adam the first man',
                avatarURL: 'https://www.photos.com/adam-naked.png',
                login: 'adam'
            }
        ];

        const memberRepository: MemberRepository = new MemberRepositoryBuilder()
            .withSearchMembersNotInBoard(async () => {
                return expectedResult;
            })
            .build();

        const boardRepository: BoardRepository = new BoardRepositoryBuilder()
            .withGetBoardById(async (id) => {
                return {
                    id,
                    name: 'Board name',
                    description: 'Board description',
                    participants: [],
                    coverURL: 'https://www.photos.com/board-cover.png',
                    private: false
                };
            })
            .build();

        const useCase = new SearchMembersUseCase(
            memberRepository,
            boardRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.members).toHaveLength(1);
        expect(presenter.response!.members).toStrictEqual(expectedResult);
    });

    it('Should limit the results to the one we set in request', async () => {
        // Given
        const expectedResults: Member[] = [
            {
                id: uuidv4(),
                name: 'Adam the first',
                avatarURL: 'https://www.photos.com/adam-naked.png',
                login: 'adam'
            },
            {
                id: uuidv4(),
                name: 'Adam the second',
                avatarURL: 'https://www.photos.com/adam-naked.png',
                login: 'adam-second'
            },
            {
                id: uuidv4(),
                name: 'Adam the third',
                avatarURL: 'https://www.photos.com/adam-naked.png',
                login: 'adam-third'
            },
            {
                id: uuidv4(),
                name: 'Adam the other',
                avatarURL: 'https://www.photos.com/adam-naked.png',
                login: 'adam-other'
            }
        ];

        const memberRepository: MemberRepository = new MemberRepositoryBuilder()
            .withSearchMembersNotInBoard(async () => {
                return expectedResults;
            })
            .build();

        const boardRepository: BoardRepository = new BoardRepositoryBuilder()
            .withGetBoardById(async (id) => {
                return {
                    id,
                    name: 'Board name',
                    description: 'Board description',
                    participants: [],
                    coverURL: 'https://www.photos.com/board-cover.png',
                    private: false
                };
            })
            .build();

        const useCase = new SearchMembersUseCase(
            memberRepository,
            boardRepository
        );

        // When
        await useCase.execute({ ...request, limit: 3 }, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.members).toHaveLength(3);
        expect(presenter.response!.members).toStrictEqual(
            expectedResults.slice(0, 3)
        );
    });

    it('should should show errors if boardId does not exists', async () => {
        // Given
        const memberRepository: MemberRepository = new MemberRepositoryBuilder()
            .withSearchMembersNotInBoard(async () => {
                return [];
            })
            .build();

        const boardRepository: BoardRepository = new BoardRepositoryBuilder()
            .withGetBoardById(async (id) => {
                return null;
            })
            .build();

        const useCase = new SearchMembersUseCase(
            memberRepository,
            boardRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).not.toBeNull();
        expect(presenter.response!.errors!.boardId).toHaveLength(1);
    });

    describe('Invalid Requests', () => {
        const dataset: { label: string; request: SearchMembersRequest }[] = [
            {
                label: 'Empty query',
                request: {
                    ...request,
                    query: ''
                }
            },
            {
                label: 'Empty boardId',
                request: {
                    ...request,
                    boardId: ''
                }
            },
            {
                label: 'Zero limit',
                request: {
                    ...request,
                    limit: 0
                }
            },
            {
                label: 'Negative limit',
                request: {
                    ...request,
                    limit: -1
                }
            }
        ];

        it.each(dataset)(
            'shows errors with invalid request : "$label"',
            async ({ request }) => {
                // Given
                const memberRepository: MemberRepository =
                    new MemberRepositoryBuilder()
                        .withSearchMembersNotInBoard(async () => {
                            return [
                                {
                                    id: uuidv4(),
                                    name: 'Adam the first man',
                                    avatarURL:
                                        'https://www.photos.com/adam-naked.png',
                                    login: 'adam'
                                }
                            ];
                        })
                        .build();

                const boardRepository: BoardRepository =
                    new BoardRepositoryBuilder()
                        .withGetBoardById(async (id) => {
                            return {
                                id,
                                name: 'Board name',
                                description: 'Board description',
                                participants: [],
                                coverURL:
                                    'https://www.photos.com/board-cover.png',
                                private: false
                            };
                        })
                        .build();

                const useCase = new SearchMembersUseCase(
                    memberRepository,
                    boardRepository
                );

                // When
                await useCase.execute(request, presenter);

                // Then
                expect(presenter.response?.errors).not.toBe(null);
            }
        );
    });
});
