import { SeeBoardDetailsRequest } from './SeeBoardDetailsRequest';
import { SeeBoardDetailsPresenter } from './SeeBoardDetailsPresenter';
import { SeeBoardDetailsResponse } from './SeeBoardDetailsResponse';
import { FieldErrors } from '../../utils/types';
import Validator from 'validatorjs';
import {
    BoardAggregate,
    BoardAggregateRepository
} from '../../entities/BoardAggregate';
Validator.useLang('fr');

export class SeeBoardDetailsUseCase {
    RULES = {
        id: 'required|string'
    };

    constructor(private repository: BoardAggregateRepository) {}

    async execute(
        request: SeeBoardDetailsRequest,
        presenter: SeeBoardDetailsPresenter
    ): Promise<void> {
        let errors = this.validate(request);

        const board = await this.repository.getBoardAggregateById(request.id);

        if (board === null) {
            errors = {
                id: ["Ce tableau n'existe pas"]
            };
        }

        presenter.present(new SeeBoardDetailsResponse(board, errors));
    }

    validate(request: SeeBoardDetailsRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.id': 'Le champ id est requis'
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
