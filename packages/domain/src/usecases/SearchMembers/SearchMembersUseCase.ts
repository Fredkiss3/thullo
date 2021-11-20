import { SearchMembersRequest } from './SearchMembersRequest';
import { SearchMembersPresenter } from './SearchMembersPresenter';
import { SearchMembersResponse } from './SearchMembersResponse';
import { FieldErrors } from '../../utils/types';
import Validator from 'validatorjs';
import { MemberRepository } from '../../entities/Member';
Validator.useLang('fr');

export class SearchMembersUseCase {
    RULES = {
        query: 'required|string',
        boardId: 'required|string',
        limit: 'required|integer|min:1',
    };

    constructor(private memberRepository: MemberRepository) {}

    async execute(
        request: SearchMembersRequest,
        presenter: SearchMembersPresenter
    ): Promise<void> {
        let errors = this.validate(request);

        const members = await this.memberRepository.searchMembersNotInBoard(
            request.query,
            request.boardId
        );

        presenter.present(
            new SearchMembersResponse(members.slice(0, request.limit), errors)
        );
    }

    validate(request: SearchMembersRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.query': 'La requête est requise',
            'required.boardId': 'L\'id du tableau est requis',
            'required.limit': 'Veuillez indiquer la limite',
            'integer.limit': 'La limite doit être un entier',
            'min.limit': 'La limite doit être supérieure ou égale à 1',
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
