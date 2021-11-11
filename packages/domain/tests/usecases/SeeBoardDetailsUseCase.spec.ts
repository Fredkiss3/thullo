import {
    SeeBoardDetailsRequest,
    SeeBoardDetailsUseCase,
    SeeBoardDetailsPresenter,
    SeeBoardDetailsResponse,
    BoardAggregate
} from '@thullo/domain';
import { BoardAggregateRepositoryBuilder } from '../builder/BoardAggregateRepositoryBuilder';
import { v4 as uuidv4 } from 'uuid';

const presenter = new (class implements SeeBoardDetailsPresenter {
    response?: SeeBoardDetailsResponse | null;

    present(response: SeeBoardDetailsResponse): void {
        this.response = response;
    }
})();

const BOARD_ID = uuidv4();

const request: SeeBoardDetailsRequest = {
    id: BOARD_ID
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
                member: {
                    id: uuidv4(),
                    login: 'zeus',
                    password:
                        '$2a$12$wAw/.WVPaDZXyFT7FIfkGOrCAYTfHPrgXLd7ABu8WBl6.ResQDvSq', // "password123."
                    name: 'Zeus God of thunder',
                    avatarURL: 'https://www.photos.com/thunder.png'
                }
            }
        ]
    }
);

describe('SeeBoardDetails Use case', () => {
    it('is successful', async () => {
        // Given
        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return aggregate;
            })
            .build();

        const useCase = new SeeBoardDetailsUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.aggregate).toBe(aggregate);
    });

    it('Should show an error is board does not exists', async () => {
        // Given
        const boardAggregateRepository = new BoardAggregateRepositoryBuilder()
            .withGetBoardAggregateById(async () => {
                return null;
            })
            .build();

        const useCase = new SeeBoardDetailsUseCase(boardAggregateRepository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors?.id).toContainEqual(
            "Ce tableau n'existe pas"
        );
    });

    describe('Invalid Requests', () => {
        const dataset: { label: string; request: SeeBoardDetailsRequest }[] = [
            {
                label: 'No Id provided',
                request: {
                    ...request,
                    id: ''
                }
            }
        ];

        it.each(dataset)(
            'shows errors with invalid request : "$label"',
            async ({ request }) => {
                // Given
                const boardAggregateRepository =
                    new BoardAggregateRepositoryBuilder()
                        .withGetBoardAggregateById(async (id) => {
                            return aggregate;
                        })
                        .build();
                const useCase = new SeeBoardDetailsUseCase(
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
