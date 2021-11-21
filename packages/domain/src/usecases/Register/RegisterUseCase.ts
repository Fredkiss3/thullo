import { RegisterRequest } from './RegisterRequest';
import { RegisterPresenter } from './RegisterPresenter';
import { RegisterResponse } from './RegisterResponse';
import { FieldErrors } from '../../utils/types';
import Validator from 'validatorjs';
import { MemberRepository } from '../../entities/Member';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
Validator.useLang('fr');

export class RegisterUseCase {
    RULES = {
        login: 'required|regex:/^[a-z]+([a-z0-9-])*[^-]$/',
        name: 'required',
        password: 'required|regex:/^(?=.*[0-9])(?=.*[a-z])(?=.*\\W).{6,}$/',
        avatarURL: 'required|url'
    };

    constructor(private memberRepository: MemberRepository) {}

    async execute(
        request: RegisterRequest,
        presenter: RegisterPresenter
    ): Promise<void> {
        let errors = this.validate(request);

        if (errors === null) {
            if (
                (await this.memberRepository.getMemberByLogin(
                    request.login
                )) !== null
            ) {
                errors = {
                    login: ['Un utilisateur avec le login existe déjà']
                };
            } else {
                const hash = await bcrypt.hash(request.password, 12);
                await this.memberRepository.register({
                    id: uuidv4(),
                    ...request,
                    password: hash
                });
            }
        }

        presenter.present(new RegisterResponse(errors));
    }

    validate(request: RegisterRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'regex.password':
                'Le format du mot de passe est invalide, le format attendu est :\n' +
                '- Au moins une lettre\n' +
                '- Au moins un chiffre\n' +
                '- Au moins un caractère spécial (exemples : @, &, +, * )\n' +
                '- Au moins 6 caractères\n',
            'regex.login':
                'Le format du login est invalide, le format attendu est : \n' +
                '- Des lettres minuscules\n' +
                '- Des chiffres (optionnel)\n' +
                '- Sans espace \n' +
                '- Ne commençant pas par un chiffre\n' +
                "- Et ne se terminant pas par un trait d'union",
            'url.avatarURL': 'Veuillez saisir une URL valide pour votre avatar',
            'required.name': 'Veuillez renseigner votre nom',
            'required.login': 'Veuillez renseigner votre login',
            'required.password': 'Veuillez renseigner votre mot de passe',
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
