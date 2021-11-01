import { AddBoardRequest } from './AddBoardRequest';
import { AddBoardPresenter } from './AddBoardPresenter';
import { AddBoardResponse } from './AddBoardResponse';
import { FieldErrors } from '../../utils/types';
import Validator from 'validatorjs';
import { MemberRepository } from '../../entities/Member';
import { BoardRepository } from '../../entities/Board';
import { randomUUID as uuidv4 } from 'crypto';
Validator.useLang('fr');

export class AddBoardUseCase {
    RULES = {
        name: 'required',
        cover: 'required',
        ownerId: 'required',
        private: 'required|boolean'
    };

    constructor(
        private memberRepository: MemberRepository,
        private boardRepository: BoardRepository
    ) {}

    async execute(
        request: AddBoardRequest,
        presenter: AddBoardPresenter
    ): Promise<void> {
        let errors = this.validate(request);

        if (null === errors) {
            const owner = await this.memberRepository.getMemberById(
                request.ownerId
            );

            if (null !== owner) {
                this.boardRepository.addBoard({
                    name: request.name,
                    cover: request.cover,
                    private: request.private,
                    id: uuidv4(),
                    participants: [],
                    description: null,
                    owner
                });
            } else {
                errors = {
                    ownerId: ["Cet utilisateur n'existe pas"]
                };
            }
        }

        presenter.present(new AddBoardResponse(errors));
    }

    validate(request: AddBoardRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            required: {
                name: 'Veuillez saisir le nom du tableau',
                cover: 'Veuillez uploader une image de couverture pour le tableau',
                private: 'Veuillez renseigner la visibilité du tableau',
                ownerId: 'Veuillez renseigner le propriétaire'
            }
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
