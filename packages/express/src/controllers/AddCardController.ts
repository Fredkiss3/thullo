import { AddCardToListPresenter, AddCardToListUseCase } from '@thullo/domain';
import type {
    AddCardToListPresenterAdapter,
    AddCardToListViewModel,
} from '@thullo/adapters';
import type { Request, Response } from 'express';
import { container, inject, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';
import { getUser } from '../lib/functions';
import short from 'short-uuid';

@injectable()
export class AddCardController extends AbstractController {
    constructor(
        @inject('AddCardToListPresenter')
        private presenter: AddCardToListPresenterAdapter
    ) {
        super();
    }

    // HTTP POST /api/boards/:boardId/lists/:listId/cards
    async handle(
        req: Request,
        res: Response
    ): Promise<Response<AddCardToListViewModel>> {
        const useCase = new AddCardToListUseCase(
            await container.resolve('BoardAggregateRepository')
        );

        const member = await getUser(req);

        await useCase.execute(
            {
                requesterId: short().toUUID(member!.id),
                boardId: short().toUUID(req.params.boardId),
                listId: short().toUUID(req.params.listId),
                title: req.body.title,
            },
            this.presenter
        );
        return this.getResult(this.presenter.vm!, res);
    }
}
