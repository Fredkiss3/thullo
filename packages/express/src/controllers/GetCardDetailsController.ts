import { SeeCardDetailsPresenter, SeeCardDetailsUseCase } from '@thullo/domain';
import type {
    SeeCardDetailsPresenterAdapter,
    SeeCardDetailsViewModel,
} from '@thullo/adapters';
import type { Request, Response } from 'express';
import { container, inject, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';
import { getUser } from '../lib/functions';
import short from 'short-uuid';

@injectable()
export class GetCardDetailsController extends AbstractController {
    constructor(
        @inject('SeeCardDetailsPresenter')
        private presenter: SeeCardDetailsPresenterAdapter
    ) {
        super();
    }

    // HTTP GET /api/boards/:boardId/cards/:cardId
    async handle(
        req: Request,
        res: Response
    ): Promise<Response<SeeCardDetailsViewModel>> {
        const useCase = new SeeCardDetailsUseCase(
            await container.resolve('BoardAggregateRepository')
        );

        const member = await getUser(req);

        await useCase.execute(
            {
                cardId: short().toUUID(req.params.cardId),
                boardId: short().toUUID(req.params.boardId),
                requestedBy: short().toUUID(member!.id),
            },
            this.presenter
        );
        return this.getResult(this.presenter.vm!, res);
    }
}
