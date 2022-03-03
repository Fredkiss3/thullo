import {
    InviteMemberToBoardPresenter,
    InviteMemberToBoardRequest,
    InviteMemberToBoardUseCase,
    MemberId,
} from '@thullo/domain';
import { InviteMemberToBoardPresenterAdapter } from '@thullo/adapters';
import type { Request, Response } from 'express';
import { container, inject, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';
import { getUser } from '../lib/functions';
import short from 'short-uuid';

@injectable()
export class AddMemberToBoardController extends AbstractController {
    constructor(
        @inject('InviteMemberToBoardPresenter')
        private presenter: InviteMemberToBoardPresenterAdapter
    ) {
        super();
    }

    // HTTP GET /api/boards/:boardId/invite
    async handle(req: Request, res: Response): Promise<Response> {
        const useCase = new InviteMemberToBoardUseCase(
            await container.resolve('MemberRepository'),
            await container.resolve('BoardRepository')
        );

        const member = await getUser(req);
        const ids: MemberId[] = req.body.memberIds || [];

        await useCase.execute(
            {
                boardId: short().toUUID(req.params.boardId),
                memberIds: ids.map(id => short().toUUID(id)),
                initiatorId: short().toUUID(member!.id),
            },
            this.presenter
        );
        return this.getResult(this.presenter.vm!, res);
    }
}
