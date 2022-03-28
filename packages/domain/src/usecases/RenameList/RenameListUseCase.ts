import { RenameListRequest } from './RenameListRequest';
import { RenameListPresenter } from './RenameListPresenter';
import { RenameListResponse } from './RenameListResponse';
import { FieldErrors } from '../../lib/types';
import Validator from 'validatorjs';
import { BoardAggregateRepository } from '../../entities/BoardAggregate';
Validator.useLang('fr');

export class RenameListUseCase {
    RULES = {
        newName: 'required|string',
        boardId: 'required|string',
        listId: 'required|string',
        requestedBy: 'required|string'
    };

    constructor(private boardAggregateRepository: BoardAggregateRepository) {}

    async execute(
        request: RenameListRequest,
        presenter: RenameListPresenter
    ): Promise<void> {
        let errors = this.validate(request);

        if (!errors) {
            const board =
                await this.boardAggregateRepository.getBoardAggregateById(
                    request.boardId
                );

            if (board) {
                const list = board.listsByIds[request.listId];

                if (list) {
                    if (board.isParticipant(request.requestedBy)) {
                        list.name = request.newName;
                        await this.boardAggregateRepository.saveAggregate(
                            board
                        );
                    } else {
                        errors = {
                            requestedBy: [
                                'You must be the admin to rename this list.'
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

        presenter.present(new RenameListResponse(errors));
    }

    validate(request: RenameListRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.newName': 'The New name is required.',
            'required.boardId': 'The Board is required.',
            'required.listId': 'The List is required.',
            'required.requestedBy':
                'The user requesting the rename is required.'
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
