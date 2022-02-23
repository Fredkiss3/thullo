import { AddCardToListRequest } from './AddCardToListRequest';
import { AddCardToListPresenter } from './AddCardToListPresenter';
import { AddCardToListResponse } from './AddCardToListResponse';
import { FieldErrors } from '../../lib/types';
import Validator from 'validatorjs';
import {
    BoardAggregateRepository,
    ListNotFoundError
} from '../../entities/BoardAggregate';
import { MemberRepository } from '../../entities/Member';
Validator.useLang('fr');

export class AddCardToListUseCase {
    RULES = {
        title: 'required|string',
        boardId: 'required|string',
        listId: 'required|string',
        requesterId: 'required|string'
    };

    constructor(private boardAggregateRepository: BoardAggregateRepository) {}

    async execute(
        request: AddCardToListRequest,
        presenter: AddCardToListPresenter
    ): Promise<void> {
        let errors = this.validate(request);

        const board = await this.boardAggregateRepository.getBoardAggregateById(
            request.boardId
        );

        if (board) {
            if (!board.isParticipant(request.requesterId)) {
                errors = {
                    requesterId: ["Vous n'êtes pas membre de ce tableau"]
                };
            } else {
                try {
                    board.addCardToList(request.title, request.listId);
                    await this.boardAggregateRepository.saveAggregate(board);
                } catch (e) {
                    if (e instanceof ListNotFoundError) {
                        errors = {
                            listId: [e.message]
                        };
                    }
                }
            }
        } else {
            errors = {
                boardId: ["Ce tableau n'existe pas"]
            };
        }

        presenter.present(new AddCardToListResponse(errors));
    }

    validate(request: AddCardToListRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.title': 'Le titre est requis',
            'required.boardId': "L'id du tableau est requis",
            'required.listId': "L'id de la liste est requis",
            'required.requesterId': "L'id de l'utilisateur est requis"
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
