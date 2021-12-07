import { AddBoardRequest } from './AddBoardRequest';
import { AddBoardPresenter } from './AddBoardPresenter';
import { AddBoardResponse } from './AddBoardResponse';
import { FieldErrors } from '../../lib/types';
import Validator from 'validatorjs';
import { MemberRepository } from '../../entities/Member';
import { Board, BoardRepository } from "../../entities/Board";
import { v4 as uuidv4 } from 'uuid';
Validator.useLang('fr');

export class AddBoardUseCase {
    RULES = {
        name: 'required',
        memberId: 'required',
        private: 'required|boolean',
        coverURL: 'required|url'
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
        let board: Board | null = null;

        if (null === errors) {
            const owner = await this.memberRepository.getMemberById(
                request.memberId
            );

            if (null !== owner) {
                board = await this.boardRepository.addBoard({
                    name: request.name,
                    private: request.private,
                    coverURL: request.coverURL,
                    id: uuidv4(),
                    description: null,
                    participants: [{ isAdmin: true, member: owner }]
                });
            } else {
                errors = {
                    memberId: ["Cet utilisateur n'existe pas"]
                };
            }
        }

        presenter.present(new AddBoardResponse(board, errors));
    }

    validate(request: AddBoardRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.name': 'Veuillez saisir le nom du tableau',
            'required.coverURL':
                'Veuillez uploader une image de couverture pour le tableau',
            'required.private': 'Veuillez renseigner la visibilité du tableau',
            'required.memberId': 'Veuillez renseigner le propriétaire',
            'boolean.private':
                'La visibilité du tableau doit être public ou privée',
            'url.coverURL': "l'image de couverture doit être une URL valide"
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
