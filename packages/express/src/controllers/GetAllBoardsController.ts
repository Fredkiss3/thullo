import { SeeBoardsPresenterAdapter } from '@thullo/adapters';
import { SeeBoardsUseCase } from '@thullo/domain';
import { Request, Response } from 'express';
import { container, inject, injectable } from 'tsyringe';
import { getUser } from '../lib/functions';
import { AbstractController } from './AbstractController';

@injectable()
export class GetAllBoardsController extends AbstractController {
    constructor(
        @inject('SeeBoardsPresenter')
        private presenter: SeeBoardsPresenterAdapter
    ) {
        super();
    }

    // HTTP GET /api/boards
    async handle(req: Request, res: Response): Promise<Response> {
        const useCase = new SeeBoardsUseCase(
            await container.resolve('MemberRepository'),
            await container.resolve('BoardRepository')
        );

        const member = await getUser(req);

        await useCase.execute(
            {
                memberId: member?.id,
            },
            this.presenter
        );
        return this.getResult(this.presenter.vm!, res);
    }
}
