import { SeeBoardsRequest } from './SeeBoardsRequest';
import { SeeBoardsPresenter } from './SeeBoardsPresenter';
import { SeeBoardsResponse } from './SeeBoardsResponse';
import { FieldErrors } from '../../utils/types';
import Validator from 'validatorjs';
import { Member, MemberRepository } from '../../entities/Member';
import { Board, BoardRepository } from '../../entities/Board';
Validator.useLang('fr');

export class SeeBoardsUseCase {
    constructor(
        private memberRepository: MemberRepository,
        private boardRepository: BoardRepository
    ) {}

    async execute(
        request: SeeBoardsRequest,
        presenter: SeeBoardsPresenter
    ): Promise<void> {
        let errors: FieldErrors = null;
        let boards: Board[] | null = null;

        let member = await this.memberRepository.getMemberById(
            request.memberId
        );

        if (null === member) {
            errors = {
                memberId: ["Il n'existe aucun utilisateur ayant cet Id"]
            };
        } else {
            boards =
                await this.boardRepository.getAllBoardsWhereMemberIsPresentOrIsOwner(
                    member.id
                );
        }

        presenter.present(new SeeBoardsResponse(boards, errors));
    }
}
