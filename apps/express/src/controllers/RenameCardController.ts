import { RenameCardPresenter, RenameCardUseCase } from '@thullo/domain';
import type {
    RenameCardPresenterAdapter,
    RenameCardViewModel,
} from '@thullo/adapters';
import type { Request, Response } from 'express';
import { container, inject, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';
import { getUser } from '../lib/functions';
import short from 'short-uuid';

@injectable()
export class RenameCardController extends AbstractController {
    constructor(
        @inject('RenameCardPresenter')
        private presenter: RenameCardPresenterAdapter
    ) {
        super();
    }

    // HTTP PUT /api/boards/:boardId/cards/:cardId/rename
    async handle(
        req: Request,
        res: Response
    ): Promise<Response<RenameCardViewModel>> {
        const useCase = new RenameCardUseCase(
            await container.resolve('BoardAggregateRepository')
        );

        const member = await getUser(req);

        await useCase.execute(
            {
                cardId: short().toUUID(req.params.cardId),
                boardId: short().toUUID(req.params.boardId),
                requestedBy: short().toUUID(member!.id),
                title: req.body.title,
            },
            this.presenter
        );
        return this.getResult(this.presenter.vm!, res);
    }
}
