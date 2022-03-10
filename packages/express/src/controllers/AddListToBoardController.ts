import { AddListToBoardPresenter, AddListToBoardUseCase } from '@thullo/domain';
import type {
    AddListToBoardPresenterAdapter,
    AddListToBoardViewModel,
} from '@thullo/adapters';
import type { Request, Response } from 'express';
import { container, inject, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';
import { getUser } from '../lib/functions';
import short from 'short-uuid';

@injectable()
export class AddListToBoardController extends AbstractController {
    constructor(
        @inject('AddListToBoardPresenter')
        private presenter: AddListToBoardPresenterAdapter
    ) {
        super();
    }

    // HTTP POST /api/boards/:boardId/lists
    async handle(
        req: Request,
        res: Response
    ): Promise<Response<AddListToBoardViewModel>> {
        const useCase = new AddListToBoardUseCase(
            await container.resolve('BoardAggregateRepository')
        );
        const member = await getUser(req);

        await useCase.execute(
            {
                name: req.body.name,
                requesterId: short().toUUID(member!.id),
                boardId: short().toUUID(req.params.boardId),
            },
            this.presenter
        );
        return this.getResult(this.presenter.vm!, res);
    }
}
