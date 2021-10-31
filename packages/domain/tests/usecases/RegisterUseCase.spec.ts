import {
    RegisterRequest,
    RegisterUseCase,
    RegisterPresenter,
    RegisterResponse,
    Member
} from '@thullo/domain';
import { MemberRepository } from '@thullo/domain';
import { MemberRepositoryBuilder } from '../builder/MemberRepositoryBuilder';
import bcrypt from 'bcrypt';

const presenter = new (class implements RegisterPresenter {
    response?: RegisterResponse | null;

    present(response: RegisterResponse): void {
        this.response = response;
    }
})();

const request: RegisterRequest = {
    name: 'Adrien KISSIE',
    password: 'password123.',
    avatar: 'randomfilename.jpeg',
    login: 'fredkiss3'
};

describe('Register Use case', () => {
    it('is successful', async () => {
        // Given
        let memberAdded: Member | null = null;
        const repository: MemberRepository = new MemberRepositoryBuilder()
            .withRegister(async (member) => {
                memberAdded = member;
            })
            .build();
        const useCase = new RegisterUseCase(repository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors).toBe(null);
        expect(memberAdded).not.toBe(null);
        expect((memberAdded as unknown as Member).login).toBe(request.login);
        expect((memberAdded as unknown as Member).avatar).toBe(request.avatar);
        expect((memberAdded as unknown as Member).name).toBe(request.name);
    });

    it('Shows error if another user with same login exists', async () => {
        // Given
        const repository: MemberRepository = new MemberRepositoryBuilder()
            .withGetMemberByLogin(async (login) => {
                return {
                    id: 'id',
                    ...request,
                    name: 'John Doe',
                    login: login
                };
            })
            .build();
        const useCase = new RegisterUseCase(repository);

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response?.errors).not.toBe(null);
        expect(presenter.response?.errors?.login).toContainEqual(
            'Un utilisateur avec le login existe déjà'
        );
    });

    it('does not add to repository if login already exists', async () => {
        // Given
        let memberAdded: Member | null = null;
        // Given
        const repository: MemberRepository = new MemberRepositoryBuilder()
            .withGetMemberByLogin(async (login) => {
                return {
                    id: 'id',
                    ...request,
                    name: 'John Doe',
                    login
                };
            })
            .withRegister(async (member) => {
                memberAdded = member;
            })
            .build();

        const useCase = new RegisterUseCase(repository);

        // When
        await useCase.execute(request, presenter);
        expect(memberAdded).toBe(null);
    });

    it('Hashes the password when saved in the repository', async () => {
        // Given
        let memberAdded: Member | null = null;

        // Given
        const repository: MemberRepository = new MemberRepositoryBuilder()
            .withRegister(async (member) => {
                memberAdded = member;
            })
            .build();

        const useCase = new RegisterUseCase(repository);

        // When
        await useCase.execute(request, presenter);
        expect((memberAdded as unknown as Member).password).not.toBe(
            request.password
        );

        // compare hashes
        const match = await bcrypt.compare(
            request.password,
            (memberAdded as unknown as Member).password
        );

        expect(match).toBe(true);
    });

    describe('Invalid Requests', () => {
        const dataset: { label: string; request: RegisterRequest }[] = [
            {
                label: 'login format invalid (with Spaces)',
                request: {
                    ...request,
                    login: 'invalid login'
                }
            },
            {
                label: 'login format invalid (with number in the beginning)',
                request: {
                    ...request,
                    login: '1nvalid-login'
                }
            },
            {
                label: 'login format invalid (End with a hyphen)',
                request: {
                    ...request,
                    login: 'invalid-login-'
                }
            },
            {
                label: 'login format invalid (with uppercase letters)',
                request: {
                    ...request,
                    login: 'Invalid-Login'
                }
            },
            {
                label: 'login format invalid (with invalid characters)',
                request: {
                    ...request,
                    login: 'Invalid-Login'
                }
            },
            {
                label: 'name empty',
                request: {
                    ...request,
                    name: ''
                }
            },
            {
                label: 'name empty (with spaces)',
                request: {
                    ...request,
                    name: ' '
                }
            },
            {
                label: 'login empty',
                request: {
                    ...request,
                    login: ''
                }
            },
            {
                label: 'login empty (with spaces)',
                request: {
                    ...request,
                    login: ' '
                }
            },
            {
                label: 'password too short (less than six characters)',
                request: {
                    ...request,
                    password: 'hello'
                }
            },
            {
                label: 'password invalid (Needs at least one digit)',
                request: {
                    ...request,
                    password: 'hellothere'
                }
            },
            {
                label: 'password invalid (Needs at least one special char)',
                request: {
                    ...request,
                    password: 'hellothere123'
                }
            },
            {
                label: 'password invalid (Needs at least one letter)',
                request: {
                    ...request,
                    password: '123456+'
                }
            }
        ];

        it.each(dataset)(
            'shows errors and do not add to repository when invalid request : "$label"',
            async ({ request }) => {
                // Given
                let memberAdded: Member | null = null;
                const repository: MemberRepository =
                    new MemberRepositoryBuilder()
                        .withRegister(async (member) => {
                            memberAdded = member;
                        })
                        .build();

                const useCase = new RegisterUseCase(repository);

                // When
                await useCase.execute(request, presenter);

                // Then
                expect(presenter.response?.errors).not.toBe(null);
                expect(memberAdded).toBe(null);
            }
        );
    });
});
