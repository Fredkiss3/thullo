import { UpdateCardDescriptionRequest } from './UpdateCardDescriptionRequest';
import { UpdateCardDescriptionPresenter } from './UpdateCardDescriptionPresenter';
import { UpdateCardDescriptionResponse } from './UpdateCardDescriptionResponse';
import { FieldErrors } from '../../lib/types';
import Validator from 'validatorjs';
import { BoardAggregateRepository } from '../../entities/BoardAggregate';
import * as console from 'console';
Validator.useLang('fr');

export class UpdateCardDescriptionUseCase {
    RULES = {
        cardId: 'required|string',
        boardId: 'required|string',
        requestedBy: 'required|string',
        description: 'string'
    };

    constructor(private boardAggregateRepository: BoardAggregateRepository) {}

    async execute(
        request: UpdateCardDescriptionRequest,
        presenter: UpdateCardDescriptionPresenter
    ): Promise<void> {
        let errors = this.validate(request);

        if (!errors) {
            const board =
                await this.boardAggregateRepository.getBoardAggregateById(
                    request.boardId
                );

            if (!board) {
                errors = {
                    boardId: ['Board not found']
                };
            } else {
                if (!board.isParticipant(request.requestedBy)) {
                    errors = {
                        requestedBy: [
                            'You can not update card description' +
                                ' if you are not a participant of the board'
                        ]
                    };
                } else {
                    try {
                        const card = board.getCardById(request.cardId);
                        card.description = request.description;
                        await this.boardAggregateRepository.saveAggregate(
                            board
                        );
                    } catch (e) {
                        errors = {
                            cardId: ['Card not found']
                        };
                    }
                }
            }
        }

        presenter.present(new UpdateCardDescriptionResponse(errors));
    }

    validate(request: UpdateCardDescriptionRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.cardId': 'Card id is required',
            'required.boardId': 'Board id is required',
            'required.requestedBy':
                'The user who requested the update is required'
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
