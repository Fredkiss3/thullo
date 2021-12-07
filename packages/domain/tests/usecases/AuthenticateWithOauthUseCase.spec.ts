import {
    AuthenticateWithOauthRequest,
    AuthenticateWithOauthUseCase,
    AuthenticateWithOauthPresenter,
    AuthenticateWithOauthResponse,
    Member
} from '@thullo/domain';
import { OAuthGatewayBuilder } from '../builder/OAuthGatewayBuilder';
import { MemberRepositoryBuilder } from '../builder/MemberRepositoryBuilder';
import { v4 as uuidv4 } from 'uuid';

const presenter = new (class implements AuthenticateWithOauthPresenter {
    response?: AuthenticateWithOauthResponse | null;

    present(response: AuthenticateWithOauthResponse): void {
        this.response = response;
    }
})();

const request: AuthenticateWithOauthRequest = {
    authCode: 'abc'
};

describe('Authenticate With Oauth Use case', () => {
    it('should register user if user does not exists', async () => {
        // Given
        let memberExpected: Member | null = null;

        const gateway = new OAuthGatewayBuilder()
            .withGetAccessToken(async () => ({
                accessToken: 'accessToken',
                idToken: 'idToken'
            }))
            .withGetUserInfo(async () => ({
                loginOrEmail: 'zeus@olympus.com',
                name: 'Zeus God Of Thunder',
                avatarURL: 'http://picsum.photos/400/400'
            }))
            .build();
        const memberRepository = new MemberRepositoryBuilder()
            .withRegister(async (member) => {
                memberExpected = member;
            })
            .build();

        const useCase = new AuthenticateWithOauthUseCase(
            gateway,
            memberRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);

        expect(memberExpected).not.toBe(null);

        expect(memberExpected!.name).toBe('Zeus God Of Thunder');
        expect(memberExpected!.login).toBe('zeus@olympus.com');
        expect(memberExpected!.avatarURL).toBe('http://picsum.photos/400/400');
        expect(presenter.response!.member).toBe(memberExpected);
    });

    it('should just return the existant user if user exists ', async () => {
        // Given
        let memberExpected: Member | null = null;
        const memberToReturn: Member = {
            id: uuidv4(),
            login: 'zeus@olympus.com',
            name: 'Zeus God Of Thunder',
            avatarURL: 'http://picsum.photos/400/400'
        };

        const gateway = new OAuthGatewayBuilder()
            .withGetAccessToken(async () => ({
                accessToken: 'accessToken',
                idToken: 'idToken'
            }))
            .withGetUserInfo(async () => ({
                loginOrEmail: 'zeus@olympus.com',
                name: 'Zeus God Of Thunder',
                avatarURL: 'http://picsum.photos/400/400'
            }))
            .build();

        const memberRepository = new MemberRepositoryBuilder()
            .withGetMemberByIdToken(async (token) => {
                return memberToReturn;
            })
            .withRegister(async (member) => {
                memberExpected = member;
            })
            .build();

        const useCase = new AuthenticateWithOauthUseCase(
            gateway,
            memberRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);

        expect(memberExpected).toBe(null);
        expect(presenter.response!.member).toBe(memberToReturn);
    });

    it('should show errors if auth code is invalid', async () => {
        // Given
        const gateway = new OAuthGatewayBuilder().build();
        const memberRepository = new MemberRepositoryBuilder().build();

        const useCase = new AuthenticateWithOauthUseCase(
            gateway,
            memberRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).not.toBe(null);
        expect(presenter.response!.errors!.authCode).toHaveLength(1);
    });

    it('should show errors if could not retrieve user infos', async () => {
        // Given
        const gateway = new OAuthGatewayBuilder()
            .withGetAccessToken(async () => ({
                accessToken: 'accessToken',
                idToken: 'idToken'
            }))
            .build();
        const memberRepository = new MemberRepositoryBuilder().build();

        const useCase = new AuthenticateWithOauthUseCase(
            gateway,
            memberRepository
        );

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
        expect(presenter.response!.errors).not.toBe(null);
        expect(presenter.response!.errors!.global).toHaveLength(1);
    });

    describe('Invalid Requests', () => {
        const dataset: {
            label: string;
            request: AuthenticateWithOauthRequest;
        }[] = [
            {
                label: 'Empty authCode',
                request: {
                    ...request,
                    authCode: ''
                }
            }
        ];

        it.each(dataset)(
            'shows errors with invalid request : "$label"',
            async ({ request }) => {
                // Given
                const gateway = new OAuthGatewayBuilder()
                    .withGetAccessToken(async () => ({
                        accessToken: 'accessToken',
                        idToken: 'idToken'
                    }))
                    .withGetUserInfo(async () => ({
                        loginOrEmail: 'zeus@olympus.com',
                        name: 'Zeus God Of Thunder',
                        avatarURL: 'http://picsum.photos/400/400'
                    }))
                    .build();
                const memberRepository = new MemberRepositoryBuilder().build();

                const useCase = new AuthenticateWithOauthUseCase(
                    gateway,
                    memberRepository
                );

                // When
                await useCase.execute(request, presenter);

                // Then
                expect(presenter.response!.errors).not.toBe(null);
                expect(presenter.response!.member).toBe(null);
            }
        );
    });
});
