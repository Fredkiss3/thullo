import { InviteMemberToBoardRequest } from './InviteMemberToBoardRequest';
import { InviteMemberToBoardPresenter } from './InviteMemberToBoardPresenter';
import { InviteMemberToBoardResponse } from './InviteMemberToBoardResponse';
import { FieldErrors } from '../../lib/types';
import Validator from 'validatorjs';
import {
    BoardAggregateRepository,
    MemberAlreadyInBoardError
} from '../../entities/BoardAggregate';
import { MemberRepository } from '../../entities/Member';
Validator.useLang('fr');

export class InviteMemberToBoardUseCase {
    RULES = {
        boardId: 'required|string',
        memberId: 'required|string',
        requesterId: 'required|string'
    };

    constructor(
        private memberRepository: MemberRepository,
        private boardAggregateRepository: BoardAggregateRepository
    ) {}

    async execute(
        request: InviteMemberToBoardRequest,
        presenter: InviteMemberToBoardPresenter
    ): Promise<void> {
        let errors = this.validate(request);

        if (!errors) {
            const member = await this.memberRepository.getMemberById(
                request.memberId
            );

            if (member) {
                const board =
                    await this.boardAggregateRepository.getBoardAggregateById(
                        request.boardId
                    );

                if (board) {
                    if (!board.isParticipant(request.requesterId)) {
                        errors = {
                            requesterId: [
                                "Vous n'êtes pas membre de ce tableau"
                            ]
                        };
                    } else {
                        try {
                            board.addMemberToBoard(member);
                            await this.boardAggregateRepository.save(board);
                        } catch (e) {
                            errors = {
                                memberId: [
                                    (e as MemberAlreadyInBoardError).message
                                ]
                            };
                        }
                    }
                } else {
                    errors = {
                        boardId: ["Ce tableau n'existe pas"]
                    };
                }
            } else {
                errors = {
                    memberId: ["Cet utilisateur n'existe pas"]
                };
            }
        }

        presenter.present(new InviteMemberToBoardResponse(errors));
    }

    validate(request: InviteMemberToBoardRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.memberId': "Veuillez saisir l'utilisateur à inviter",
            'required.boardId': 'Veuillez saisir le tableau',
            'required.requesterId': "Veuillez saisir l'utilisateur qui invite"
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
