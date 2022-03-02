import Validator from 'validatorjs';
import { BoardAggregate, BoardAggregateRepository } from "../../entities/BoardAggregate";
import { MemberRepository } from '../../entities/Member';
import { FieldErrors } from '../../lib/types';
import { MemberAlreadyInBoardError } from "../../entities/BoardAggregate";
import { InviteMemberToBoardPresenter } from './InviteMemberToBoardPresenter';
import { InviteMemberToBoardRequest } from './InviteMemberToBoardRequest';
import { InviteMemberToBoardResponse } from './InviteMemberToBoardResponse';
Validator.useLang('fr');

export class InviteMemberToBoardUseCase {
    RULES = {
        boardId: 'required|string',
        initiatorId: 'required|string',
        memberId: 'required|string'
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

           const member = await this.memberRepository.getMemberById(
             request.memberId
           );

           if (member != null) {
               if (board != null) {
                   if (board.isParticipant(request.initiatorId)) {
                       try {
                           board.addMemberToBoard(member);
                           await this.boardRepository.saveAggregate(board);
                       } catch (e) {
                           board = null;
                           errors = {
                               memberId: [(e as MemberAlreadyInBoardError).message]
                           };
                       }
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
           } else {
               board = null;
               errors = {
                   memberId: ["Cet utilisateur n'existe pas."]
               };
           }
       }

        presenter.present(new InviteMemberToBoardResponse(board, errors));
    }

    validate(request: InviteMemberToBoardRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.boardId': 'Le tableau est requis.',
            'required.initiatorId': "L'initiateur de l'action est requis.",
            'required.memberId': 'Le membre est requis.'
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
