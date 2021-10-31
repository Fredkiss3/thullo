import {
    AuthenticateRequest,
    AuthenticateUseCase,
    AuthenticatePresenter,
    AuthenticateResponse,
    MemberRepository,
    Member
} from '@thullo/domain';
import { MemberRepositoryBuilder } from '../builder/MemberRepositoryBuilder';

const presenter = new (class implements AuthenticatePresenter {
    response?: AuthenticateResponse | null;

    present(response: AuthenticateResponse): void {
        this.response = response;
    }
})();

const request: AuthenticateRequest = {
    login: 'fredkiss3',
    password: 'password'
};

const memberExpected: Member = {
    id: 'id',
    ...request,
    password: '$2a$12$wAw/.WVPaDZXyFT7FIfkGOrCAYTfHPrgXLd7ABu8WBl6.ResQDvSq', // "password123."
    name: 'Fred KISS',
    avatar: null
};

describe('Authenticate Use case', () => {
    beforeEach(() => {
        presenter.response = null;
    });

    it('is successful', async () => {
        // Given
        const repository: MemberRepository = new MemberRepositoryBuilder()
            .withGetMemberByLogin(async (login) => {
                return memberExpected;
            })
            .build();
        const useCase = new AuthenticateUseCase(repository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response?.member).toStrictEqual(memberExpected);
    });

    it('Should show error if login does not exist', async () => {
        // Given
        const repository: MemberRepository = new MemberRepositoryBuilder()
            .withGetMemberByLogin(async (login) => {
                return login !== 'non-existant' ? memberExpected : null;
            })
            .build();
        const useCase = new AuthenticateUseCase(repository);

        // When
        await useCase.execute({ ...request, login: 'non-existant' }, presenter);

        // Then
        expect(presenter.response?.member).toBe(null);
        expect(presenter.response?.errors).not.toBe(null);
        expect(presenter.response?.errors?.login).toContainEqual(
            'Aucun utilisateur ne correspond à ce login'
        );
    });

    it('Should show error if password is invalid', async () => {
        // Given
        const repository: MemberRepository = new MemberRepositoryBuilder()
            .withGetMemberByLogin(async (login) => {
                return memberExpected;
            })
            .build();
        const useCase = new AuthenticateUseCase(repository);

        // When
        await useCase.execute({ ...request, password: 'invalid' }, presenter);

        // Then
        expect(presenter.response?.member).toBe(null);
        expect(presenter.response?.errors).not.toBe(null);
        expect(presenter.response?.errors?.global).toContainEqual(
            'Identifiants incorrects'
        );
    });

    describe('Invalid Requests', () => {
        const dataset: { label: string; request: AuthenticateRequest }[] = [
            {
                label: 'Empty login',
                request: {
                    ...request,
                    login: ''
                }
            },
            {
                label: 'Empty login (with spaces)',
                request: {
                    ...request,
                    login: ' '
                }
            },
        ];

        it.each(dataset)(
            'shows errors with invalid request : "$label"',
            async ({ request }) => {
                // Give
                const repository: MemberRepository =
                    new MemberRepositoryBuilder()
                        .withGetMemberByLogin(async (login) => {
                            return memberExpected;
                        })
                        .build();
                const useCase = new AuthenticateUseCase(repository);

                // When
                await useCase.execute(request, presenter);

                // Then
                expect(presenter.response?.member).toBe(null);
                expect(presenter.response?.errors).not.toBe(null);
            }
        );
    });
});
