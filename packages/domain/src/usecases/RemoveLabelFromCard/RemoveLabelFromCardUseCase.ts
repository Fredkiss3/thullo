import {
    BoardAggregateRepository,
    CardNotFoundError,
    LabelNotFoundError
} from '../../entities/BoardAggregate';
import { RemoveLabelFromCardRequest } from './RemoveLabelFromCardRequest';
import { RemoveLabelFromCardPresenter } from './RemoveLabelFromCardPresenter';
import { RemoveLabelFromCardResponse } from './RemoveLabelFromCardResponse';
import { FieldErrors } from '../../lib/types';
import Validator from 'validatorjs';
Validator.useLang('fr');

export class RemoveLabelFromCardUseCase {
    RULES = {
        boardId: 'required|string',
        cardId: 'required|string',
        labelId: 'required|string',
        requestedBy: 'required|string'
    };

    constructor(private boardAggregateRepository: BoardAggregateRepository) {}

    async execute(
        request: RemoveLabelFromCardRequest,
        presenter: RemoveLabelFromCardPresenter
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
                try {
                    if (board.isParticipant(request.requestedBy)) {
                        board.removeLabelFromCard(
                            request.cardId,
                            request.labelId
                        );

                        await this.boardAggregateRepository.saveAggregate(
                            board!
                        );
                    } else {
                        errors = {
                            requestedBy: ['User is not a member of the board']
                        };
                    }
                } catch (e) {
                    if (e instanceof LabelNotFoundError) {
                        errors = {
                            labelId: ['Label not found']
                        };
                    } else if (e instanceof CardNotFoundError) {
                        errors = {
                            cardId: ['Card not found']
                        };
                    }
                }
            }
        }

        presenter.present(new RemoveLabelFromCardResponse(errors));
    }

    validate(request: RemoveLabelFromCardRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.labelId': 'Label is required',
            'required.cardId': 'Card is required',
            'required.boardId': 'Board is required',
            'required.requestedBy': 'The user is required'
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
