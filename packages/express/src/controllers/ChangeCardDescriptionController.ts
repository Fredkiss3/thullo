import {
    UpdateCardDescriptionPresenter,
    UpdateCardDescriptionUseCase,
} from '@thullo/domain';
import type {
    UpdateCardDescriptionPresenterAdapter,
    UpdateCardDescriptionViewModel,
} from '@thullo/adapters';
import type { Request, Response } from 'express';
import { container, inject, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';
import { getUser } from '../lib/functions';
import short from 'short-uuid';

@injectable()
export class ChangeCardDescriptionController extends AbstractController {
    constructor(
        @inject('UpdateCardDescriptionPresenter')
        private presenter: UpdateCardDescriptionPresenterAdapter
    ) {
        super();
    }

    // HTTP PUT /api/boards/:boardId/cards/:cardId/set-description
    async handle(
        req: Request,
        res: Response
    ): Promise<Response<UpdateCardDescriptionViewModel>> {
        const useCase = new UpdateCardDescriptionUseCase(
            await container.resolve('BoardAggregateRepository')
        );

        const member = await getUser(req);

        await useCase.execute(
            {
                cardId: short().toUUID(req.params.cardId),
                boardId: short().toUUID(req.params.boardId),
                requestedBy: short().toUUID(member!.id),
                description: req.body.description,
            },
            this.presenter
        );
        return this.getResult(this.presenter.vm!, res);
    }
}
