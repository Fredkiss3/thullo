import {
    SetBoardVisibilityPresenter,
    SetBoardVisibilityUseCase,
} from '@thullo/domain';
import { SetBoardVisibilityPresenterAdapter } from '@thullo/adapters';
import type { Request, Response } from 'express';
import { container, inject, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';
import short from 'short-uuid';
import { getUser } from '../lib/functions';

@injectable()
export class SetBoardVisibilityController extends AbstractController {
    constructor(
        @inject('SetBoardVisibilityPresenter')
        private presenter: SetBoardVisibilityPresenterAdapter
    ) {
        super();
    }

    // HTTP PUT /api/boards/:boardId/set-visibility
    async handle(req: Request, res: Response): Promise<Response> {
        const useCase = new SetBoardVisibilityUseCase(
            await container.resolve('BoardAggregateRepository')
        );

        const member = await getUser(req);

        await useCase.execute(
            {
                boardId: short().toUUID(req.params.boardId),
                requesterId: short().toUUID(member!.id),
                private: req.body.private,
            },
            this.presenter
        );
        return this.getResult(this.presenter.vm!, res);
    }
}
