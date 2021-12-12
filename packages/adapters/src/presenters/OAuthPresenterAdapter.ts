import {
    AuthenticateWithOauthPresenter,
    AuthenticateWithOauthResponse,
    FieldErrors,
    Member
} from '@thullo/domain';
import { container, injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';

type OAuthData = {
    token: string;
};
export interface OAuthViewModel {
    data: OAuthData | null;
    errors: FieldErrors;
}

@injectable()
export class OAuthPresenterAdapter implements AuthenticateWithOauthPresenter {
    vm: OAuthViewModel | null = null;

    constructor(private jwt_secret: string) {}

    present(response: AuthenticateWithOauthResponse) {
        this.vm = {
            data: this.OAuthData(response.member),
            errors: response.errors
        };
    }

    OAuthData(member: Member | null): OAuthData | null {
        return member === null
            ? null
            : {
                  token: jwt.sign(
                      {
                        login: member.login,
                        name: member.name,
                        email: member.email!,
                        avatarURL: member.avatarURL
                      },
                      this.jwt_secret,
                      {
                          expiresIn: '7d',
                          algorithm: 'HS256'
                      }
                  )
              };
    }
}

container.register('AuthenticateWithOauthPresenter', {
    useFactory: () => {
        return new OAuthPresenterAdapter(process.env.JWT_SECRET!);
    }
});
