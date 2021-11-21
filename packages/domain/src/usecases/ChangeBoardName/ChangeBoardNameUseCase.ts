import { ChangeBoardNameRequest } from './ChangeBoardNameRequest';
import { ChangeBoardNamePresenter } from './ChangeBoardNamePresenter';
import { ChangeBoardNameResponse } from './ChangeBoardNameResponse';
import { FieldErrors } from '../../utils/types';
import Validator from 'validatorjs';
import {
    BoardAggregateRepository,
    OperationUnauthorizedError
} from '../../entities/BoardAggregate';
import { MemberRepository } from '../../entities/Member';
Validator.useLang('fr');

export class ChangeBoardNameUseCase {
    RULES = {
        name: 'required|string',
        boardId: 'required|string',
        requesterId: 'required|string'
    };

    constructor(
        private memberRepository: MemberRepository,
        private boardAggregateRepository: BoardAggregateRepository
    ) {}

    async execute(
        request: ChangeBoardNameRequest,
        presenter: ChangeBoardNamePresenter
    ): Promise<void> {
        let errors = this.validate(request);

        const board = await this.boardAggregateRepository.getBoardAggregateById(
            request.boardId
        );

        const member = await this.memberRepository.getMemberById(
            request.requesterId
        );

        if (board) {
            if (member) {
                try {
                    board.setName(request.name, member.id);
                    await this.boardAggregateRepository.save(board);
                } catch (e) {
                    errors = {
                        requesterId: [(e as OperationUnauthorizedError).message]
                    };
                }
            } else {
                errors = {
                    requesterId: ["Cet utilisateur n'existe pas"]
                };
            }
        } else {
            errors = {
                boardId: ["Ce tableau n'existe pas"]
            };
        }

        presenter.present(new ChangeBoardNameResponse(errors));
    }

    validate(request: ChangeBoardNameRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.name': 'Le nom du tableau est requis',
            'required.boardId': "L'id du tableau est requis",
            'required.requesterId': "L'id de l'utilisateur est requis"
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
