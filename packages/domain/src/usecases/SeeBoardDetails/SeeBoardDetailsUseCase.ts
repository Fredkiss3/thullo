import { SeeBoardDetailsRequest } from './SeeBoardDetailsRequest';
import { SeeBoardDetailsPresenter } from './SeeBoardDetailsPresenter';
import { SeeBoardDetailsResponse } from './SeeBoardDetailsResponse';
import { FieldErrors } from '../../utils/types';
import Validator from 'validatorjs';
import { BoardAggregateRepository } from '../../entities/BoardAggregate';
import { MemberRepository } from '../../entities/Member';
Validator.useLang('fr');

export class SeeBoardDetailsUseCase {
    RULES = {
        boardId: 'required|string',
        requesterId: 'required|string',
    };

    constructor(
        private memberRepository: MemberRepository,
        private repository: BoardAggregateRepository
    ) {}

    async execute(
        request: SeeBoardDetailsRequest,
        presenter: SeeBoardDetailsPresenter
    ): Promise<void> {
        let errors = this.validate(request);

        let board = await this.repository.getBoardAggregateById(
            request.boardId
        );

        const member = await this.memberRepository.getMemberById(
            request.requesterId
        );

        if (board === null) {
            errors = {
                boardId: ["Ce tableau n'existe pas"]
            };
        } else if (member === null) {
            board = null;
            errors = {
                requesterId: ["Cet utilisateur n'existe pas"]
            };
        } else {
            if(board.isPrivate && !board.isParticipant(member!.id)) {
                board = null;
                errors = {
                    requesterId: ["Vous n'êtes pas membre de ce tableau"]
                };
            }
        }

        presenter.present(new SeeBoardDetailsResponse(board, errors));
    }

    validate(request: SeeBoardDetailsRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.boardId': 'Le tableau est requis',
            'required.requesterId': 'L\'utilisateur est requis',
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
