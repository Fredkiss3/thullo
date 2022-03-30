import Validator from 'validatorjs';
import { FieldErrors } from '../../lib/types';
import { BoardAggregateRepository } from '../../entities/BoardAggregate';
import { OperationUnauthorizedError } from '../../entities/BoardAggregate';
import { UpdateBoardDescriptionPresenter } from './UpdateBoardDescriptionPresenter';
import { UpdateBoardDescriptionRequest } from './UpdateBoardDescriptionRequest';
import { UpdateBoardDescriptionResponse } from './UpdateBoardDescriptionResponse';
Validator.useLang('fr');

export class UpdateBoardDescriptionUseCase {
    RULES = {
        initiatorId: 'required|string',
        boardId: 'required|string',
        description: 'string'
    };

    constructor(private boardAggregateRepository: BoardAggregateRepository) {}

    async execute(
        request: UpdateBoardDescriptionRequest,
        presenter: UpdateBoardDescriptionPresenter
    ): Promise<void> {
        let errors = this.validate(request);

        const board = await this.boardAggregateRepository.getBoardAggregateById(
            request.boardId
        );

        if (board === null) {
            errors = {
                boardId: ["Ce tableau n'existe pas."]
            };
        } else {
            try {
                board.setDescription(request.description, request.initiatorId);
                await this.boardAggregateRepository.saveAggregate(board);
            } catch (e) {
                errors = {
                    initiatorId: [(e as OperationUnauthorizedError).message]
                };
            }
        }

        presenter.present(new UpdateBoardDescriptionResponse(errors));
    }

    validate(request: UpdateBoardDescriptionRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.initiatorId': 'Le champ "initiatorId" est requis.',
            'required.boardId':
                'Veuillez spécifier un tableau où modifier la description.',
            'string.description':
                'La description doit être une chaîne de caractères.'
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
