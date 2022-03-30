import { SeeCardDetailsRequest } from './SeeCardDetailsRequest';
import { SeeCardDetailsPresenter } from './SeeCardDetailsPresenter';
import { SeeCardDetailsResponse } from './SeeCardDetailsResponse';
import { FieldErrors } from '../../lib/types';
import Validator from 'validatorjs';
import { BoardAggregateRepository } from '../../entities/BoardAggregate';
import { Card, CardRepository } from '../../entities/Card';
Validator.useLang('fr');

export class SeeCardDetailsUseCase {
    RULES = {
        cardId: 'required|string',
        boardId: 'required|string',
        requestedBy: 'required|string'
    };

    constructor(private boardAggregateRepository: BoardAggregateRepository) {}

    async execute(
        request: SeeCardDetailsRequest,
        presenter: SeeCardDetailsPresenter
    ): Promise<void> {
        let errors = this.validate(request);

        let card: Card | null = null;

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
                if (
                    board.isPrivate &&
                    !board.isParticipant(request.requestedBy)
                ) {
                    errors = {
                        requestedBy: [
                            'You can not see this card because the board is private'
                        ]
                    };
                } else {
                    try {
                        card = board.getCardById(request.cardId);
                    } catch (e) {
                        errors = {
                            cardId: ['Card not found']
                        };
                    }
                }
            }
        }
        presenter.present(new SeeCardDetailsResponse(card, errors));
    }

    validate(request: SeeCardDetailsRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.cardId': 'the card is required',
            'required.boardId': 'the board is required',
            'required.requestedBy': 'The user requesting the card is required'
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
