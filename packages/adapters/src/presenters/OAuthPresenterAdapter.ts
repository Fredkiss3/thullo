import {
    AuthenticateWithOauthPresenter,
    AuthenticateWithOauthResponse,
    FieldErrors,
    Member
} from '@thullo/domain';
import short from 'short-uuid';
import { container, injectable } from 'tsyringe';

type OAuthData = {
    id: string;
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
                  id: short().fromUUID(member.id)
              };
    }
}

container.register('AuthenticateWithOauthPresenter', {
    useClass: OAuthPresenterAdapter
});
