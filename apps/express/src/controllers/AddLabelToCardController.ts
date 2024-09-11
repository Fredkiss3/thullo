import { AddLabelToCardPresenter, AddLabelToCardUseCase } from '@thullo/domain';
import type {
    AddLabelToCardPresenterAdapter,
    AddLabelToCardViewModel,
} from '@thullo/adapters';
import type { Request, Response } from 'express';
import { container, inject, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';
import short from 'short-uuid';
import { getUser } from '../lib/functions';

@injectable()
export class AddLabelToCardController extends AbstractController {
    constructor(
        @inject('AddLabelToCardPresenter')
        private presenter: AddLabelToCardPresenterAdapter
    ) {
        super();
    }

    // HTTP PUT /api/boards/:boardId/cards/:cardId/add-label
    async handle(
        req: Request,
        res: Response
    ): Promise<Response<AddLabelToCardViewModel>> {
        const useCase = new AddLabelToCardUseCase(
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
                    : null,
                name: req.body.name,
                color: req.body.color,
            },
            this.presenter
        );

        return this.getResult(this.presenter.vm!, res);
    }
}
