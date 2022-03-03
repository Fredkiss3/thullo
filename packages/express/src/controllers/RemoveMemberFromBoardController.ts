import {
    RemoveMemberFromBoardPresenter,
    RemoveMemberFromBoardUseCase,
} from '@thullo/domain';
import { RemoveMemberFromBoardPresenterAdapter } from '@thullo/adapters';
import type { Request, Response } from 'express';
import { container, inject, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';
import short from 'short-uuid';
import { getUser } from '../lib/functions';

@injectable()
export class RemoveMemberFromBoardController extends AbstractController {
    constructor(
        @inject('RemoveMemberFromBoardPresenter')
        private presenter: RemoveMemberFromBoardPresenterAdapter
    ) {
        super();
    }

    // HTTP GET /api/boards/:boardId/exclude
    async handle(req: Request, res: Response): Promise<Response> {
        const useCase = new RemoveMemberFromBoardUseCase(
            await container.resolve('MemberRepository'),
            await container.resolve('BoardRepository')
        );

        const member = await getUser(req);

        await useCase.execute(
            {
                boardId: short().toUUID(req.params.boardId),
                memberId: short().toUUID(req.body.memberId ?? ''),
                initiatorId: short().toUUID(member!.id),
            },
            this.presenter
        );
        return this.getResult(this.presenter.vm!, res);
    }
}
