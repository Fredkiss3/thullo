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
import { v4 as uuidv4 } from 'uuid';
import { MemberRepositoryBuilder } from '../builder/MemberRepositoryBuilder';
import { BoardRepositoryBuilder } from '../builder/BoardRepositoryBuilder';
import { UnsplashGatewayBuilder } from '../builder/UnsplashGatewayBuilder';
import { UnsplashPhotoBuilder } from '../builder/UnsplashPhotoBuilder';

const presenter = new (class implements AddBoardPresenter {
    response?: AddBoardResponse | null;

    present(response: AddBoardResponse): void {
        this.response = response;
    }
})();

const zeus: Member = {
    id: uuidv4(),
    login: 'zeus',
    name: 'Zeus God of thunder',
    avatarURL: 'https://placekitten.com/200/300'
};

const request: AddBoardRequest = {
    name: 'Olympus Reunion',
    coverPhotoId: uuidv4(),
    private: true,
    memberId: zeus.id
};

const boardExpected: Omit<Board, 'id'> = {
    name: request.name,
    cover: new UnsplashPhotoBuilder().build(),
    private: request.private,
    description: null,
    participants: [
        {
            isAdmin: true,
            member: zeus
        }
    ]
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
                return board;
            })
            .build();

        const unsplashGateway = new UnsplashGatewayBuilder()
            .withGetPhoto(async () => new UnsplashPhotoBuilder().build())
            .build();

        const useCase = new AddBoardUseCase(
            memberRepo,
            boardRepo,
            unsplashGateway
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response?.errors).toBe(null);
        expect(boardResult).not.toBe(null);
        expect(boardResult).toBe(presenter.response?.board);
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
                return board;
            })
            .build();

        const unsplashGateway = new UnsplashGatewayBuilder()
            .withGetPhoto(async () => new UnsplashPhotoBuilder().build())
            .build();

        const useCase = new AddBoardUseCase(
            memberRepo,
            boardRepo,
            unsplashGateway
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response?.errors).not.toBe(null);
        expect(presenter.response?.errors?.memberId).toContainEqual(
            "Cet utilisateur n'existe pas"
        );
        expect(boardResult).toBe(null);
        expect(presenter.response!.board).toBe(null);
    });

    it('Shows error & does not add to repo if coverPhotoId is invalid', async () => {
        // Given
        let boardResult: Board | null = null;
        const memberRepo: MemberRepository = new MemberRepositoryBuilder()
            .withGetMemberById(async () => zeus)
            .build();

        const boardRepo: BoardRepository = new BoardRepositoryBuilder()
            .withAddBoard(async (board) => {
                boardResult = board;
                return board;
            })
            .build();

        const unsplashGateway = new UnsplashGatewayBuilder()
            .withGetPhoto(async () => null)
            .build();

        const useCase = new AddBoardUseCase(
            memberRepo,
            boardRepo,
            unsplashGateway
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response?.errors).not.toBe(null);
        expect(presenter.response?.errors?.coverPhotoId).toHaveLength(1);
        expect(boardResult).toBe(null);
        expect(presenter.response!.board).toBe(null);
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
                    coverPhotoId: ''
                }
            },
            {
                label: 'memberId empty',
                request: {
                    ...request,
                    memberId: ''
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
                        return board;
                    })
                    .build();

                const unsplashGateway = new UnsplashGatewayBuilder()
                    .withGetPhoto(async () =>
                        new UnsplashPhotoBuilder().build()
                    )
                    .build();

                const useCase = new AddBoardUseCase(
                    memberRepo,
                    boardRepo,
                    unsplashGateway
                );

                // When
                await useCase.execute(request, presenter);

                // Then
                expect(presenter.response?.errors).not.toBe(null);
                expect(boardResult).toBe(null);
                expect(presenter.response!.board).toBe(null);
            }
        );
    });
});
