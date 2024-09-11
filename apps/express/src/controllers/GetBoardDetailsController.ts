import { SeeBoardDetailsUseCase } from '@thullo/domain';
import short from 'short-uuid';
import { SeeBoardDetailsPresenterAdapter } from '@thullo/adapters';
import type { Request, Response } from 'express';
import { container, inject, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';
import { getUser } from '../lib/functions';

@injectable()
export class GetBoardDetailsController extends AbstractController {
    constructor(
        @inject('SeeBoardDetailsPresenter')
        private presenter: SeeBoardDetailsPresenterAdapter
    ) {
        super();
    }

    // HTTP GET /api/boards/:boardId
    async handle(req: Request, res: Response): Promise<Response> {
        const useCase = new SeeBoardDetailsUseCase(
            await container.resolve('MemberRepository'),
            await container.resolve('BoardAggregateRepository')
        );

        const member = await getUser(req);

        await useCase.execute(
            {
                boardId: short().toUUID(req.params.boardId),
                requesterId: member ? short().toUUID(member.id) : undefined,
            },
            this.presenter
        );
        return this.getResult(this.presenter.vm!, res);
    }
}
