import {
    AddBoardRequest,
    AddBoardUseCase,
    AddBoardPresenter,
    AddBoardResponse,
    Member,
    MemberRepository,
    BoardRepository,
    Board
} from '@thullo/domain';
import { randomUUID as uuidv4 } from 'crypto';
import { MemberRepositoryBuilder } from '../builder/MemberRepositoryBuilder';
import { BoardRepositoryBuilder } from '../builder/BoardRepositoryBuilder';

const presenter = new (class implements AddBoardPresenter {
    response?: AddBoardResponse | null;

    present(response: AddBoardResponse): void {
        this.response = response;
    }
})();

const zeus: Member = {
    id: uuidv4(),
    login: 'zeus',
    password: '$2a$12$wAw/.WVPaDZXyFT7FIfkGOrCAYTfHPrgXLd7ABu8WBl6.ResQDvSq', // "password123."
    name: 'Zeus God of thunder',
    avatar: 'thunder.png'
};

const request: AddBoardRequest = {
    name: 'Olympus Reunion',
    cover: 'olympus.png',
    private: true,
    ownerId: zeus.id
};

const boardExpected: Omit<Board, 'id'> = {
    name: request.name,
    cover: request.cover,
    private: request.private,
    participants: [],
    description: null,
    owner: zeus
};

describe('AddBoard Use case', () => {
    it('is successful', async () => {
        // Given
        let boardResult: Board | null = null;
        const memberRepo: MemberRepository = new MemberRepositoryBuilder()
            .withGetMemberById(async () => zeus)
            .build();

        const boardRepo: BoardRepository = new BoardRepositoryBuilder()
            .withAddBoard(async (board) => {
                boardResult = board;
            })
            .build();

        const useCase = new AddBoardUseCase(memberRepo, boardRepo);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response?.errors).toBe(null);
        expect(boardResult).not.toBe(null);
        expect(boardResult).toMatchObject(boardExpected);
    });

    it('Shows error & does not add to repo if memberId invalid', async () => {
        // Given
        let boardResult: Board | null = null;
        const memberRepo: MemberRepository = new MemberRepositoryBuilder()
            .withGetMemberById(async () => null)
            .build();

        const boardRepo: BoardRepository = new BoardRepositoryBuilder()
            .withAddBoard(async (board) => {
                boardResult = board;
            })
            .build();

        const useCase = new AddBoardUseCase(memberRepo, boardRepo);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response?.errors).not.toBe(null);
        expect(presenter.response?.errors?.ownerId).toContainEqual(
            "Cet utilisateur n'existe pas"
        );
        expect(boardResult).toBe(null);
    });

    describe('Invalid Requests', () => {
        const dataset: { label: string; request: AddBoardRequest }[] = [
            {
                label: 'Name empty',
                request: {
                    ...request,
                    name: ''
                }
            },
            {
                label: 'cover empty',
                request: {
                    ...request,
                    name: ''
                }
            },
            {
                label: 'ownerId empty',
                request: {
                    ...request,
                    ownerId: ''
                }
            }
        ];

        it.each(dataset)(
            'shows errors & do not add to repo with invalid request : "$label"',
            async ({ request }) => {
                // Given
                let boardResult: Board | null = null;
                const memberRepo: MemberRepository =
                    new MemberRepositoryBuilder()
                        .withGetMemberById(async (id) => {
                            return id === zeus.id ? zeus : null;
                        })
                        .build();

                const boardRepo: BoardRepository = new BoardRepositoryBuilder()
                    .withAddBoard(async (board) => {
                        boardResult = board;
                    })
                    .build();

                const useCase = new AddBoardUseCase(memberRepo, boardRepo);

                // When
                await useCase.execute(request, presenter);

                // Then
                expect(presenter.response?.errors).not.toBe(null);
                expect(boardResult).toBe(null);
            }
        );
    });
});
