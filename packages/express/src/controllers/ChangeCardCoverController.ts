import { UpdateCardCoverPresenter, UpdateCardCoverUseCase } from '@thullo/domain';
import type { UpdateCardCoverPresenterAdapter, UpdateCardCoverViewModel } from '@thullo/adapters';
import type { Request, Response } from 'express';
import { container, inject, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';
import { getUser } from '../lib/functions';
import short from 'short-uuid';

@injectable()
export class ChangeCardCoverController extends AbstractController {
    constructor(
        @inject('UpdateCardCoverPresenter') private presenter: UpdateCardCoverPresenterAdapter
    ) {
        super();
    }

    // HTTP PUT /api/boards/:boardId/cards/:cardId/set-cover
    async handle(
        req: Request,
        res: Response
    ): Promise<Response<UpdateCardCoverViewModel>> {
        const useCase = new UpdateCardCoverUseCase(
            await container.resolve('BoardAggregateRepository'),
            await container.resolve('UnsplashGateway')
        );

        const member = await getUser(req);

        await useCase.execute(
            {
                cardId: short().toUUID(req.params.cardId),
                boardId: short().toUUID(req.params.boardId),
                requestedBy: short().toUUID(member!.id),
                coverPhotoId: req.body.coverPhotoId
            },
            this.presenter
        );
        return this.getResult(this.presenter.vm!, res);
    }
}
