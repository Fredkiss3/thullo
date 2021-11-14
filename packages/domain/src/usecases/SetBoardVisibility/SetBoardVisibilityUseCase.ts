import { SetBoardVisibilityRequest } from './SetBoardVisibilityRequest';
import { SetBoardVisibilityPresenter } from './SetBoardVisibilityPresenter';
import { SetBoardVisibilityResponse } from './SetBoardVisibilityResponse';
import { FieldErrors } from '../../utils/types';
import Validator from 'validatorjs';
import {
    BoardAggregateRepository,
    OperationUnauthorizedError
} from '../../entities/BoardAggregate';
Validator.useLang('fr');

export class SetBoardVisibilityUseCase {
    RULES = {
        boardId: 'required|string',
        requesterId: 'required|string',
        private: 'required|boolean'
    };

    constructor(private boardAggregateRepository: BoardAggregateRepository) {}

    async execute(
        request: SetBoardVisibilityRequest,
        presenter: SetBoardVisibilityPresenter
    ): Promise<void> {
        let errors = this.validate(request);

        const board = await this.boardAggregateRepository.getBoardAggregateById(
            request.boardId
        );

        if (board) {
            try {
                board.setVisibility(request.private, request.requesterId);
                await this.boardAggregateRepository.save(board);
            } catch (e) {
                errors = {
                    requesterId: [(e as OperationUnauthorizedError).message]
                };
            }
        } else {
            errors = {
                boardId: ["Ce tableau n'existe pas"]
            };
        }

        presenter.present(new SetBoardVisibilityResponse(errors));
    }

    validate(request: SetBoardVisibilityRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.boardId': 'Le tableau est requis',
            'required.requesterId': 'L\'utilisateur est requis',
            'required.private': 'La visibilité est requise',
            'boolean.private': 'La visibilité doit être un booléen'
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
