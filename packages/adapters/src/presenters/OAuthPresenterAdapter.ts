import {
    AuthenticateWithOauthPresenter,
    AuthenticateWithOauthResponse,
    FieldErrors,
    Member
} from '@thullo/domain';
import { container, injectable } from 'tsyringe';

type OAuthData = {
    login: string;
    name: string;
    email: string;
    avatarURL: string;
};
export interface OAuthViewModel {
    data: OAuthData | null;
    errors: FieldErrors;
}

@injectable()
export class OAuthPresenterAdapter implements AuthenticateWithOauthPresenter {
    vm: OAuthViewModel | null = null;

    present(response: AuthenticateWithOauthResponse) {
        this.vm = {
            data: this.toOAuthData(response.member),
            errors: response.errors
        };
    }

    toOAuthData(member: Member | null): OAuthData | null {
        return member === null
            ? null
            : {
                  login: member.login,
                  name: member.name,
                  email: member.email!,
                  avatarURL: member.avatarURL!
              };
    }
}

container.register('AuthenticateWithOauthPresenter', {
    useClass: OAuthPresenterAdapter
});
