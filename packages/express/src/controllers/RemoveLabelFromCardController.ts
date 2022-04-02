import {
    RemoveLabelFromCardPresenter,
    RemoveLabelFromCardUseCase,
} from '@thullo/domain';
import type {
    RemoveLabelFromCardPresenterAdapter,
    RemoveLabelFromCardViewModel,
} from '@thullo/adapters';
import type { Request, Response } from 'express';
import { container, inject, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';
import short from 'short-uuid';
import { getUser } from '../lib/functions';

@injectable()
export class RemoveLabelFromCardController extends AbstractController {
    constructor(
        @inject('RemoveLabelFromCardPresenter')
        private presenter: RemoveLabelFromCardPresenterAdapter
    ) {
        super();
    }

    // HTTP GET /api/boards/:boardId/cards/:cardId/remove-label
    async handle(
        req: Request,
        res: Response
    ): Promise<Response<RemoveLabelFromCardViewModel>> {
        const useCase = new RemoveLabelFromCardUseCase(
            await container.resolve('BoardAggregateRepository')
        );
        const member = await getUser(req);

        await useCase.execute(
            {
                cardId: short().toUUID(req.params.cardId),
                boardId: short().toUUID(req.params.boardId),
                requestedBy: short().toUUID(member!.id),
                labelId: req.body.labelId
                    ? short().toUUID(req.body.labelId)
                    : '',
            },
            this.presenter
        );
        return this.getResult(this.presenter.vm!, res);
    }
}
