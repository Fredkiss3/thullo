import short from 'short-uuid';
import { AddBoardPresenterAdapter } from '@thullo/adapters';
import { AddBoardUseCase } from '@thullo/domain';
import { Request, Response } from 'express';
import { container, inject, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';
import { getUser } from '../lib/functions';

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

        const member = await getUser(req);

        await useCase.execute(
            {
                name: req.body.name,
                private: req.body.private,
                coverPhotoId: req.body.coverPhotoId,
                memberId: short().toUUID(member!.id),
            },
            this.presenter
        );

        return this.getResult(this.presenter.vm!, res, 201);
    }
}
