import { RemoveMemberFromBoardRequest } from './RemoveMemberFromBoardRequest';
import { RemoveMemberFromBoardPresenter } from './RemoveMemberFromBoardPresenter';
import { RemoveMemberFromBoardResponse } from './RemoveMemberFromBoardResponse';
import { FieldErrors } from '../../lib/types';
import Validator from 'validatorjs';
import { MemberRepository } from '../../entities/Member';
import {
    BoardAggregate,
    BoardAggregateRepository,
    MemberNotInBoardError,
    OperationUnauthorizedError
} from '../../entities/BoardAggregate';
Validator.useLang('fr');

export class RemoveMemberFromBoardUseCase {
    RULES = {
        boardId: 'required|string',
        memberId: 'required|string',
        initiatorId: 'required|string'
    };

    constructor(
        private memberRepository: MemberRepository,
        private boardRepository: BoardAggregateRepository
    ) {}

    async execute(
        request: RemoveMemberFromBoardRequest,
        presenter: RemoveMemberFromBoardPresenter
    ): Promise<void> {
        let errors = this.validate(request);

        let board: BoardAggregate | null = null;
        if (errors === null) {
            board = await this.boardRepository.getBoardAggregateById(
                request.boardId
            );

            const member = await this.memberRepository.getMemberById(
                request.memberId
            );

            if (member != null) {
                if (board != null) {
                    try {
                        board?.removeMemberFromBoard(
                            member,
                            request.initiatorId
                        );
                        await this.boardRepository.saveAggregate(board!);
                    } catch (e) {
                        board = null;
                        if (e instanceof OperationUnauthorizedError) {
                            errors = {
                                initiatorId: [
                                    (e as OperationUnauthorizedError).message
                                ]
                            };
                        } else if (e instanceof MemberNotInBoardError) {
                            errors = {
                                memberId: [(e as MemberNotInBoardError).message]
                            };
                        }
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
        presenter.present(new RemoveMemberFromBoardResponse(board, errors));
    }

    validate(request: RemoveMemberFromBoardRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.memberId': "Cet utilisateur n'existe pas.",
            'required.boardId': "Ce tableau n'existe pas.",
            'required.initiatorId':
                'Vous devez être connecté pour effectuer cette action.'
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
