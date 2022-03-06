import { UpdateBoardDescriptionUseCase } from '@thullo/domain';
import type {
    UpdateBoardDescriptionPresenterAdapter,
    UpdateBoardDescriptionViewModel,
} from '@thullo/adapters';
import type { Request, Response } from 'express';
import { container, inject, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';
import short from 'short-uuid';
import { getUser } from '../lib/functions';

@injectable()
export class UpdateBoardDescriptionController extends AbstractController {
    constructor(
        @inject('UpdateBoardDescriptionPresenter')
        private presenter: UpdateBoardDescriptionPresenterAdapter
    ) {
        super();
    }

    // HTTP PUT /api/boards/:boardId/set-description
    async handle(
        req: Request,
        res: Response
    ): Promise<Response<UpdateBoardDescriptionViewModel>> {
        const useCase = new UpdateBoardDescriptionUseCase(
            await container.resolve('BoardAggregateRepository')
        );

        const member = await getUser(req);

        await useCase.execute(
            {
                boardId: short().toUUID(req.params.boardId),
                description: req.body.description,
                initiatorId: short().toUUID(member!.id),
            },
            this.presenter
        );
        return this.getResult(this.presenter.vm!, res);
    }
}
