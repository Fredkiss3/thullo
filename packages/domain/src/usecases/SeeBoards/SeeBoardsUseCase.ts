import { SeeBoardsRequest } from './SeeBoardsRequest';
import { SeeBoardsPresenter } from './SeeBoardsPresenter';
import { SeeBoardsResponse } from './SeeBoardsResponse';
import { FieldErrors } from '../../lib/types';
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

        let member: Member | null | undefined;

        if (request.memberId) {
            member = await this.memberRepository.getMemberById(
                request.memberId
            );
        }

        if (null === member) {
            errors = {
                memberId: ["Il n'existe aucun utilisateur ayant cet Id"]
            };
        } else {
            boards = member
                ? await this.boardRepository.getAllBoardsWhereMemberIsPresentOrWherePublic(
                      member.id
                  )
                : await this.boardRepository.getAllPublicBoards();
        }

        presenter.present(new SeeBoardsResponse(boards, errors));
    }
}
