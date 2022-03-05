import {
    ChangeBoardNamePresenter,
    ChangeBoardNameUseCase,
} from '@thullo/domain';
import type {
    ChangeBoardNamePresenterAdapter,
    ChangeBoardNameViewModel,
} from '@thullo/adapters';
import type { Request, Response } from 'express';
import { container, inject, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';
import { getUser } from '../lib/functions';
import short from 'short-uuid';

@injectable()
export class ChangeBoardNameController extends AbstractController {
    constructor(
        @inject('ChangeBoardNamePresenter')
        private presenter: ChangeBoardNamePresenterAdapter
    ) {
        super();
    }

    // HTTP PUT /api/boards/:boardId/set-name
    async handle(
        req: Request,
        res: Response
    ): Promise<Response<ChangeBoardNameViewModel>> {
        const useCase = new ChangeBoardNameUseCase(
            await container.resolve('MemberRepository'),
            await container.resolve('BoardAggregateRepository')
        );

        const member = await getUser(req);

        await useCase.execute(
            {
                boardId: short().toUUID(req.params.boardId),
                requesterId: short().toUUID(member!.id),
                name: req.body.name,
            },
            this.presenter
        );
        return this.getResult(this.presenter.vm!, res);
    }
}
