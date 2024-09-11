import { MoveCardPresenter, MoveCardUseCase } from '@thullo/domain';
import type {
    MoveCardPresenterAdapter,
    MoveCardViewModel,
} from '@thullo/adapters';
import type { Request, Response } from 'express';
import { container, inject, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';
import { getUser } from '../lib/functions';
import short from 'short-uuid';

@injectable()
export class MoveCardController extends AbstractController {
    constructor(
        @inject('MoveCardPresenter') private presenter: MoveCardPresenterAdapter
    ) {
        super();
    }

    // HTTP PUT /api/boards/:boardId/move-card
    async handle(
        req: Request,
        res: Response
    ): Promise<Response<MoveCardViewModel>> {
        const useCase = new MoveCardUseCase(
            await container.resolve('BoardAggregateRepository')
        );

        const member = await getUser(req);

        await useCase.execute(
            {
                boardId: short().toUUID(req.params.boardId),
                cardId: short().toUUID(req.body.cardId),
                destinationListId: short().toUUID(req.body.listId),
                destinationPosition: parseInt(req.body.position),
                requestedBy: short().toUUID(member!.id),
            },
            this.presenter
        );
        return this.getResult(this.presenter.vm!, res);
    }
}
