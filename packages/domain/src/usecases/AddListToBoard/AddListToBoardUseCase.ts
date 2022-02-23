import { AddListToBoardRequest } from './AddListToBoardRequest';
import { AddListToBoardPresenter } from './AddListToBoardPresenter';
import { AddListToBoardResponse } from './AddListToBoardResponse';
import { FieldErrors } from '../../lib/types';
import Validator from 'validatorjs';
import { BoardAggregateRepository } from '../../entities/BoardAggregate';
import { List } from '../../entities/List';
Validator.useLang('fr');

export class AddListToBoardUseCase {
    RULES = {
        name: 'required|string',
        boardId: 'required|string',
        requesterId: 'required|string'
    };

    constructor(private repository: BoardAggregateRepository) {}

    async execute(
        request: AddListToBoardRequest,
        presenter: AddListToBoardPresenter
    ): Promise<void> {
        let errors = this.validate(request);
        let list: List | null = null;

        const boardAggregate = await this.repository.getBoardAggregateById(
            request.boardId
        );

        if (boardAggregate !== null) {
            if (!boardAggregate.isParticipant(request.requesterId)) {
                errors = {
                    requesterId: ["Vous n'êtes pas membre de ce tableau"]
                };
            } else {
                const id = boardAggregate.addList(request.name);
                list = boardAggregate.listsByIds[id];
                await this.repository.saveAggregate(boardAggregate);
            }
        } else {
            errors = {
                boardId: ["Ce tableau n'existe pas"]
            };
        }

        presenter.present(new AddListToBoardResponse(list, errors));
    }

    validate(request: AddListToBoardRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.name': 'Le nom est requis',
            'required.boardId': "L'id du tableau est requis",
            'required.requesterId': "L'id de l'utilisateur est requis"
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
