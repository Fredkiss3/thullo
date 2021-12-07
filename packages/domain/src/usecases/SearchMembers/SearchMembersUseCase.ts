import { SearchMembersRequest } from './SearchMembersRequest';
import { SearchMembersPresenter } from './SearchMembersPresenter';
import { SearchMembersResponse } from './SearchMembersResponse';
import { FieldErrors } from '../../lib/types';
import Validator from 'validatorjs';
import { Member, MemberRepository } from '../../entities/Member';
import { BoardRepository } from '../../entities/Board';
Validator.useLang('fr');

export class SearchMembersUseCase {
    RULES = {
        query: 'required|string',
        boardId: 'required|string',
        limit: 'required|integer|min:1'
    };

    constructor(
        private memberRepository: MemberRepository,
        private boardRepository: BoardRepository
    ) {}

    async execute(
        request: SearchMembersRequest,
        presenter: SearchMembersPresenter
    ): Promise<void> {
        let errors = this.validate(request);

        const board = await this.boardRepository.getBoardById(request.boardId);
        let members: Member[] = [];

        if (!board) {
            errors = {
                boardId: ["Ce tableau n'existe pas"]
            };
        } else {
            members = await this.memberRepository.searchMembersNotInBoard(
                request.query,
                request.boardId
            );
        }

        presenter.present(
            new SearchMembersResponse(members.slice(0, request.limit), errors)
        );
    }

    validate(request: SearchMembersRequest): FieldErrors {
        const validation = new Validator(request, this.RULES, {
            'required.query': 'La requête est requise',
            'required.boardId': "L'id du tableau est requis",
            'required.limit': 'Veuillez indiquer la limite',
            'integer.limit': 'La limite doit être un entier',
            'min.limit': 'La limite doit être supérieure ou égale à 1'
        });

        if (validation.passes()) {
            return null;
        }

        return validation.errors.all();
    }
}
