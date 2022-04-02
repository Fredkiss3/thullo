import {
    LabelNotFoundError,
    CardNotFoundError
} from './../../entities/BoardAggregate/Exceptions';
import { Colors } from './../../entities/Label/Label';
import { AddLabelToCardRequest } from './AddLabelToCardRequest';
import { AddLabelToCardPresenter } from './AddLabelToCardPresenter';
import { AddLabelToCardResponse } from './AddLabelToCardResponse';
import { FieldErrors } from '../../lib/types';
import { BoardAggregateRepository } from '../../entities/BoardAggregate';
import { Label } from '../../entities/Label';

import Validator from 'validatorjs';
Validator.useLang('fr');

export class AddLabelToCardUseCase {
    RULES = {
        cardId: 'required|string',
        boardId: 'required|string',
        requestedBy: 'required|string',
        name: 'string'
    };

    constructor(private boardAggregateRepository: BoardAggregateRepository) {}

    async execute(
        request: AddLabelToCardRequest,
        presenter: AddLabelToCardPresenter
    ): Promise<void> {
        let errors = this.validate(request);
        let label: Label | null = null;

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
                        label = board.addLabelToCard(
                            request.cardId,
                            request.color ?? undefined,
                            request.name ?? undefined,
                            request.labelId ?? undefined
                        );

                        await this.boardAggregateRepository.saveAggregate(
                            board
                        );
                    } else {
                        errors = {
                            requestedBy: [
                                'You can not add label to the card' +
                                    ' if you are not a participant of the board'
                            ]
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
                    } else {
                        errors = {
                            global: [(e as Error).message]
                        };
                    }
                }
            }
        }
        presenter.present(new AddLabelToCardResponse(label, errors));
    }

    validate(request: AddLabelToCardRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.cardId': 'Card id is required',
            'required.boardId': 'Board id is required',
            'required.requestedBy':
                'The user who requested the update is required'
        });

        if (validation.passes()) {
            if (!request.labelId) {
                if (!request.name?.trim()) {
                    return {
                        name: ['Name is required if label id is not provided']
                    };
                } else if (!request.color) {
                    return {
                        color: ['Color is required if label id is not provided']
                    };
                } else if (
                    request.color &&
                    Colors[request.color] === undefined
                ) {
                    return {
                        color: [
                            `Color ${
                                request.color
                            } is not valid, should be one of ${Object.keys(
                                Colors
                            ).join(', ')}`
                        ]
                    };
                }
            }
            return null;
        }

        return validation.errors.all();
    }
}
