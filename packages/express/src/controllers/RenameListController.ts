import { RenameListPresenter, RenameListUseCase } from '@thullo/domain';
import type {
    RenameListPresenterAdapter,
    RenameListViewModel,
} from '@thullo/adapters';
import type { Request, Response } from 'express';
import { container, inject, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';
import { getUser } from '../lib/functions';
import short from 'short-uuid';

@injectable()
export class RenameListController extends AbstractController {
    constructor(
        @inject('RenameListPresenter')
        private presenter: RenameListPresenterAdapter
    ) {
        super();
    }

    // HTTP PUT /api/boards/:boardId/lists/:listId/rename
    async handle(
        req: Request,
        res: Response
    ): Promise<Response<RenameListViewModel>> {
        const useCase = new RenameListUseCase(
            await container.resolve('BoardAggregateRepository')
        );

        const member = await getUser(req);

        await useCase.execute(
            {
                newName: req.body.name,
                requestedBy: short().toUUID(member!.id),
                boardId: short().toUUID(req.params.boardId),
                listId: short().toUUID(req.params.listId),
            },
            this.presenter
        );
        return this.getResult(this.presenter.vm!, res);
    }
}
