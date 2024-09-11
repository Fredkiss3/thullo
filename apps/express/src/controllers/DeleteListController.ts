import { DeleteListPresenter, DeleteListUseCase } from '@thullo/domain';
import type {
    DeleteListPresenterAdapter,
    DeleteListViewModel,
} from '@thullo/adapters';
import type { Request, Response } from 'express';
import { container, inject, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';
import { getUser } from '../lib/functions';
import short from 'short-uuid';

@injectable()
export class DeleteListController extends AbstractController {
    constructor(
        @inject('DeleteListPresenter')
        private presenter: DeleteListPresenterAdapter
    ) {
        super();
    }

    // HTTP DELETE /api/boards/:boardId/lists/:listId
    async handle(
        req: Request,
        res: Response
    ): Promise<Response<DeleteListViewModel>> {
        const useCase = new DeleteListUseCase(
            await container.resolve('BoardAggregateRepository')
        );

        const member = await getUser(req);

        await useCase.execute(
            {
                requestedBy: short().toUUID(member!.id),
                boardId: short().toUUID(req.params.boardId),
                listId: short().toUUID(req.params.listId),
            },
            this.presenter
        );
        return this.getResult(this.presenter.vm!, res);
    }
}
