import { InviteMemberToBoardRequest } from './InviteMemberToBoardRequest';
import { InviteMemberToBoardPresenter } from './InviteMemberToBoardPresenter';
import { InviteMemberToBoardResponse } from './InviteMemberToBoardResponse';
import { FieldErrors } from '../../utils/types';
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
        memberId: 'required|string'
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

        const member = await this.memberRepository.getMemberById(
            request.memberId
        );

        if (member) {
            const board =
                await this.boardAggregateRepository.getBoardAggregateById(
                    request.boardId
                );

            if (board) {
                try {
                    board.addMemberToBoard(member);
                    await this.boardAggregateRepository.save(board);
                } catch (e) {
                    errors = {
                        memberId: [(e as MemberAlreadyInBoardError).message]
                    };
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

        presenter.present(new InviteMemberToBoardResponse(errors));
    }

    validate(request: InviteMemberToBoardRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.memberId': "Veuillez saisir l'utilisateur à inviter",
            'required.boardId': 'Veuillez saisir le tableau'
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
