import { AddBoardRequest } from './AddBoardRequest';
import { AddBoardPresenter } from './AddBoardPresenter';
import { AddBoardResponse } from './AddBoardResponse';
import { FieldErrors } from '../../lib/types';
import Validator from 'validatorjs';
import { MemberRepository } from '../../entities/Member';
import { Board, BoardRepository } from '../../entities/Board';
import { v4 as uuidv4 } from 'uuid';
import { UnsplashGateway } from '../../lib/UnsplashGateway';
Validator.useLang('fr');

export class AddBoardUseCase {
    RULES = {
        name: 'required',
        memberId: 'required',
        private: 'required|boolean',
        coverPhotoId: 'required|string'
    };

    constructor(
        private memberRepository: MemberRepository,
        private boardRepository: BoardRepository,
        private photoService: UnsplashGateway
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
                const photo = await this.photoService.getPhoto(
                    request.coverPhotoId
                );

                if(!photo) {
                    errors = {
                        coverPhotoId: ['La photo de couverture choisie n\'existe pas']
                    };
                } else {
                    board = await this.boardRepository.addBoard({
                        cover: photo,
                        name: request.name,
                        private: request.private,
                        id: uuidv4(),
                        description: null,
                        participants: [{ isAdmin: true, member: owner }]
                    });
                }
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
            'required.private': 'Veuillez renseigner la visibilité du tableau',
            'required.memberId': 'Veuillez renseigner le propriétaire',
            'boolean.private':
                'La visibilité du tableau doit être public ou privée',
            'required.coverPhotoId':
                'Veuillez renseigner une photo de couverture'
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
