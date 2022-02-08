import { AddBoardPresenterAdapter } from '@thullo/adapters';
import { AddBoardUseCase } from '@thullo/domain';
import { Request, Response } from 'express';
import { container, inject, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';

@injectable()
export class AddBoardController extends AbstractController {
    constructor(
        @inject('AddBoardPresenter') private presenter: AddBoardPresenterAdapter
    ) {
        super();
    }

    // HTTP POST /api/boards
    async handle(req: Request, res: Response): Promise<Response> {
        const useCase = new AddBoardUseCase(
            await container.resolve('MemberRepository'),
            await container.resolve('BoardRepository'),
            await container.resolve('UnsplashGateway')
        );

        await useCase.execute(
            {
                ...req.body,
                memberId: res.locals.user.id,
            },
            this.presenter
        );

        return this.getResult(this.presenter.vm!, res, 201);
    }
}
