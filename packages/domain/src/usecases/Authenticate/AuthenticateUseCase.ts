import { AuthenticateRequest } from './AuthenticateRequest';
import { AuthenticatePresenter } from './AuthenticatePresenter';
import { AuthenticateResponse } from './AuthenticateResponse';
import { FieldErrors } from '../../utils/types';
import Validator from 'validatorjs';
import { Member, MemberRepository } from '../../entities/Member';
import bcrypt from 'bcrypt';
Validator.useLang('fr');

export class AuthenticateUseCase {
    RULES = {
        login: 'required',
        password: 'required',
    };

    constructor(private memberRepository: MemberRepository) {}

    async execute(
        request: AuthenticateRequest,
        presenter: AuthenticatePresenter
    ): Promise<void> {
        let errors = this.validate(request);
        let member: Member | null = null;

        if (errors === null) {
            member = await this.memberRepository.getMemberByLogin(
                request.login
            );

            if (member === null) {
                errors = {
                    login: ['Aucun utilisateur ne correspond à ce login']
                };
            } else {
                const match = await bcrypt.compare(
                    request.password,
                    member.password
                );

                if (!match) {
                    errors = {
                        global: ['Identifiants incorrects']
                    };
                    member = null;
                }
            }
        }

        presenter.present(new AuthenticateResponse(member, errors));
    }

    validate(request: AuthenticateRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.password': "Le mot de passe est requis",
            'required.login': "Le login est requis",
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
