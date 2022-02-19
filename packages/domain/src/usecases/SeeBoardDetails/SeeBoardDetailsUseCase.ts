import { SeeBoardDetailsRequest } from './SeeBoardDetailsRequest';
import { SeeBoardDetailsPresenter } from './SeeBoardDetailsPresenter';
import { SeeBoardDetailsResponse } from './SeeBoardDetailsResponse';
import { FieldErrors } from '../../lib/types';
import Validator from 'validatorjs';
import { BoardAggregateRepository } from '../../entities/BoardAggregate';
import { Member, MemberRepository } from '../../entities/Member';
Validator.useLang('fr');

export class SeeBoardDetailsUseCase {
    RULES = {
        boardId: 'required|string',
        requesterId: 'string'
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

        let member: Member | null | undefined;

        if (request.requesterId) {
            member = await this.memberRepository.getMemberById(
                request.requesterId
            );
        }

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
            if (!board.isPrivate) {
                // do nothing
            } else if (!member) {
                board = null;
                errors = {
                    requesterId: [
                        "Vous n'avez pas le droit de voir ce tableau car il est privé"
                    ]
                };
            } else if (member && !board.isParticipant(member.id)) {
                board = null;
                errors = {
                    requesterId: [
                        "Vous n'avez pas le droit de voir ce tableau car vous n'y êtes pas invité"
                    ]
                };
            }
        }

        presenter.present(new SeeBoardDetailsResponse(board, errors));
    }

    validate(request: SeeBoardDetailsRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.boardId': 'Le tableau est requis'
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
