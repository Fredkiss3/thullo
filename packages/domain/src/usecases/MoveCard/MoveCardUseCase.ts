import { MoveCardRequest } from './MoveCardRequest';
import { MoveCardPresenter } from './MoveCardPresenter';
import { MoveCardResponse } from './MoveCardResponse';
import { FieldErrors } from '../../lib/types';
import Validator from 'validatorjs';
import {
    BoardAggregateRepository,
    CardNotFoundError,
    InvalidPositionError,
    ListNotFoundError
} from '../../entities/BoardAggregate';
Validator.useLang('fr');

export class MoveCardUseCase {
    RULES = {
        boardId: 'required|string',
        cardId: 'required|string',
        destinationListId: 'required|string',
        destinationPosition: 'required|integer|min:0',
        requestedBy: 'required|string'
    };

    constructor(private boardRepository: BoardAggregateRepository) {}

    async execute(
        request: MoveCardRequest,
        presenter: MoveCardPresenter
    ): Promise<void> {
        let errors = this.validate(request);

        if (!errors) {
            const board = await this.boardRepository.getBoardAggregateById(
                request.boardId
            );

            if (!board!.isParticipant(request.requestedBy)) {
                errors = {
                    requestedBy: ['You are not a participant of this board']
                };
            } else {
                try {
                    board!.moveCard(
                        request.cardId,
                        request.destinationListId,
                        request.destinationPosition
                    );

                    await this.boardRepository.save(board!);
                } catch (e) {
                    if (e instanceof ListNotFoundError) {
                        errors = {
                            destinationListId: [e.message]
                        };
                    } else if (e instanceof CardNotFoundError) {
                        errors = {
                            cardId: [e.message]
                        };
                    } else if (e instanceof InvalidPositionError) {
                        errors = {
                            destinationPosition: [e.message]
                        };
                    }
                }
            }
        }

        presenter.present(new MoveCardResponse(errors));
    }

    validate(request: MoveCardRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.boardId': 'Le tableau est requis',
            'required.cardId': 'La carte est requise',
            'required.destinationListId': 'La liste est requise',
            'required.destinationPosition': 'La position est requise',
            'required.requestedBy': "L'utilisateur est requis",
            'integer.destinationPosition': 'La position doit être un entier',
            'min.destinationPosition':
                'La position doit être supérieure ou égale à 0'
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
