import Validator from 'validatorjs';
import {
    BoardAggregate,
    BoardAggregateRepository
} from '../../entities/BoardAggregate';
import { MemberRepository } from '../../entities/Member';
import { FieldErrors } from '../../lib/types';
import { InviteMemberToBoardPresenter } from './InviteMemberToBoardPresenter';
import { InviteMemberToBoardRequest } from './InviteMemberToBoardRequest';
import { InviteMemberToBoardResponse } from './InviteMemberToBoardResponse';
Validator.useLang('fr');

export class InviteMemberToBoardUseCase {
    RULES = {
        boardId: 'required|string',
        initiatorId: 'required|string',
        memberIds: 'required|array|min:1'
    };

    constructor(
        private memberRepository: MemberRepository,
        private boardRepository: BoardAggregateRepository
    ) {}

    async execute(
        request: InviteMemberToBoardRequest,
        presenter: InviteMemberToBoardPresenter
    ): Promise<void> {
        let errors = this.validate(request);

        let board: BoardAggregate | null = null;

        if (!errors) {
            board = await this.boardRepository.getBoardAggregateById(
                request.boardId
            );

            const members = await this.memberRepository.getMembersByIds(
                request.memberIds
            );

            if (members.length !== 0) {
                if (board != null) {
                    if (board.isParticipant(request.initiatorId)) {
                        for (const member of members) {
                            board.addMemberToBoard(member);
                        }
                        await this.boardRepository.saveAggregate(board);
                    } else {
                        board = null;
                        errors = {
                            initiatorId: [
                                "Ce membre n'est pas un participant de ce tableau."
                            ]
                        };
                    }
                } else {
                    errors = {
                        boardId: ["Ce tableau n'existe pas."]
                    };
                }
            }
        }

        presenter.present(new InviteMemberToBoardResponse(board, errors));
    }

    validate(request: InviteMemberToBoardRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.boardId': 'Le tableau est requis.',
            'required.initiatorId': "L'initiateur de l'action est requis.",
            'required.memberIds': 'Veuillez saisir au moins un membre.',
            'min.memberIds': 'les members a ajouter sont requis.',
            'array.memberIds':
                "Veuillez envoyer un tableau d'identifiants de membres."
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
