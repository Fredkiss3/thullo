import { DeleteListRequest } from './DeleteListRequest';
import { DeleteListPresenter } from './DeleteListPresenter';
import { DeleteListResponse } from './DeleteListResponse';
import { FieldErrors } from '../../lib/types';
import Validator from 'validatorjs';
import { BoardAggregateRepository } from '../../entities/BoardAggregate';
Validator.useLang('fr');

export class DeleteListUseCase {
    RULES = {
        listId: 'required|string',
        boardId: 'required|string',
        requestedBy: 'required|string'
    };

    constructor(private boardAggregateRepository: BoardAggregateRepository) {}

    async execute(
        request: DeleteListRequest,
        presenter: DeleteListPresenter
    ): Promise<void> {
        let errors = this.validate(request);

        if (!errors) {
            const board =
                await this.boardAggregateRepository.getBoardAggregateById(
                    request.boardId
                );

            if (board) {
                if (request.listId in board.listsByIds) {
                    if (board.isParticipant(request.requestedBy)) {
                        board.removeListFromBoard(request.listId);

                        await this.boardAggregateRepository.saveAggregate(
                            board
                        );
                    } else {
                        errors = {
                            requestedBy: [
                                'User is not a participant of this board'
                            ]
                        };
                    }
                } else {
                    errors = {
                        listId: ['List not found']
                    };
                }
            } else {
                errors = {
                    boardId: ['Board not found']
                };
            }
        }

        presenter.present(new DeleteListResponse(errors));
    }

    validate(request: DeleteListRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.listId': 'the List is required',
            'required.boardId': 'the Board is required',
            'required.requestedBy': 'the User is required'
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
