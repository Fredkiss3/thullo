import {
    SearchMembersRequest,
    SearchMembersUseCase,
    SearchMembersPresenter,
    SearchMembersResponse,
    MemberRepository,
    SearchMembersResult
} from '@thullo/domain';
import { MemberRepositoryBuilder } from '../builder/MemberRepositoryBuilder';
import { v4 as uuidv4 } from 'uuid';

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
        const expectedResult: SearchMembersResult[] = [
            {
                id: uuidv4(),
                name: 'Adam the first man',
                avatarURL: 'https://www.photos.com/adam-naked.png'
            }
        ];

        const repository: MemberRepository = new MemberRepositoryBuilder()
            .withSearchMembersNotInBoard(async () => {
                return expectedResult;
            })
            .build();

        const useCase = new SearchMembersUseCase(repository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.members).toHaveLength(1);
        expect(presenter.response!.members).toStrictEqual(expectedResult);
    });

    it('Should limit the results to the one we set in request', async () => {
        // Given
        const expectedResults: SearchMembersResult[] = [
            {
                id: uuidv4(),
                name: 'Adam the first',
                avatarURL: 'https://www.photos.com/adam-naked.png'
            },
            {
                id: uuidv4(),
                name: 'Adam the second',
                avatarURL: 'https://www.photos.com/adam-naked.png'
            },
            {
                id: uuidv4(),
                name: 'Adam the third',
                avatarURL: 'https://www.photos.com/adam-naked.png'
            },
            {
                id: uuidv4(),
                name: 'Adam the other',
                avatarURL: 'https://www.photos.com/adam-naked.png'
            }
        ];

        const repository: MemberRepository = new MemberRepositoryBuilder()
            .withSearchMembersNotInBoard(async () => {
                return expectedResults;
            })
            .build();

        const useCase = new SearchMembersUseCase(repository);

        // When
        await useCase.execute({ ...request, limit: 3 }, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.members).toHaveLength(3);
        expect(presenter.response!.members).toStrictEqual(
            expectedResults.slice(0, 3)
        );
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
                const repository: MemberRepository = new MemberRepositoryBuilder()
                    .build();

                const useCase = new SearchMembersUseCase(repository);

                // When
                await useCase.execute(request, presenter);

                // Then
                expect(presenter.response?.errors).not.toBe(null);
            }
        );
    });
});
