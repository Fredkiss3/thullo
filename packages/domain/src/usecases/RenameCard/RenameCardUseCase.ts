import { RenameCardRequest } from './RenameCardRequest';
import { RenameCardPresenter } from './RenameCardPresenter';
import { RenameCardResponse } from './RenameCardResponse';
import { FieldErrors } from '../../lib/types';
import Validator from 'validatorjs';
import { BoardAggregateRepository } from '../../entities/BoardAggregate';
Validator.useLang('fr');

export class RenameCardUseCase {
    RULES = {
        cardId: 'required|string',
        boardId: 'required|string',
        requestedBy: 'required|string',
        title: 'required|string'
    };

    constructor(private boardAggregateRepository: BoardAggregateRepository) {}

    async execute(
        request: RenameCardRequest,
        presenter: RenameCardPresenter
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
                            'You can not rename a card if you are not a participant of the board'
                        ]
                    };
                } else {
                    try {
                        const card = board.getCardById(request.cardId);
                        card.title = request.title;
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
        presenter.present(new RenameCardResponse(errors));
    }

    validate(request: RenameCardRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.cardId': 'the card is required',
            'required.boardId': 'the board is required',
            'required.requestedBy':
                'The user who requested the card is required',
            'required.title': 'The new title is required'
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
