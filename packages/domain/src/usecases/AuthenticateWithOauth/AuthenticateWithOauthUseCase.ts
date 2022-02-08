import { v4 as uuidv4 } from 'uuid';
import Validator from 'validatorjs';
import { Member, MemberRepository } from '../../entities/Member';
import { OAuthGateway } from '../../lib/OAuthGateway';
import { FieldErrors } from '../../lib/types';
import { AuthenticateWithOauthPresenter } from './AuthenticateWithOauthPresenter';
import { AuthenticateWithOauthRequest } from './AuthenticateWithOauthRequest';
import { AuthenticateWithOauthResponse } from './AuthenticateWithOauthResponse';

Validator.useLang('fr');

export class AuthenticateWithOauthUseCase {
    RULES = {
        authCode: 'required|string'
    };

    constructor(
        private authGateway: OAuthGateway,
        private memberRepository: MemberRepository
    ) {}

    async execute(
        request: AuthenticateWithOauthRequest,
        presenter: AuthenticateWithOauthPresenter
    ): Promise<void> {
        let errors = this.validate(request);
        let member: Member | null = null;

        if (!errors) {
            const authResult = await this.authGateway.getAccessToken(
                request.authCode
            );

            if (authResult === null) {
                errors = {
                    authCode: [
                        "Une erreur d'authentification est survenue " +
                            "(Code d'accès invalide), " +
                            "veuillez recommencer l'opération."
                    ]
                };
            } else {
                const userInfo = await this.authGateway.getUserInfo(
                    authResult.accessToken,
                    authResult.idToken
                );

                if (userInfo === null) {
                    errors = {
                        global: [
                            "Une erreur d'authentification est survenue, " +
                                '(invalid accessToken or invalid idToken)' +
                                "veuillez recommencer l'opération."
                        ]
                    };
                } else {
                    member = await this.memberRepository.getMembersByEmail(
                        userInfo.email
                    );

                    if (member === null) {
                        member = {
                            id: uuidv4(),
                            login: userInfo.login,
                            email: userInfo.email,
                            avatarURL: userInfo.avatarURL,
                            name: userInfo.name,
                            idToken: authResult.idToken
                        };

                        await this.memberRepository.register(member);
                    }
                }
            }
        }

        presenter.present(new AuthenticateWithOauthResponse(member, errors));
    }

    validate(request: AuthenticateWithOauthRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.authCode': "Le code d'authentification est requis."
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
