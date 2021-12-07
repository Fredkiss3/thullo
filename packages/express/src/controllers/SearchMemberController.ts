import { SearchMembersPresenterAdapter } from '@thullo/adapters';
import { SearchMembersUseCase } from '@thullo/domain';
import { Request, Response } from 'express';
import { container, inject, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';

@injectable()
export class SearchMemberController extends AbstractController {
    constructor(
        @inject('SearchMembersPresenter')
        private presenter: SearchMembersPresenterAdapter
    ) {
        super();
    }

    // HTTP GET /api/members/search?q=:query&boardId=:boardId
    async handle(req: Request, res: Response): Promise<Response> {
        const useCase = new SearchMembersUseCase(
            await container.resolve('MemberRepository'),
            await container.resolve('BoardRepository')
        );

        await useCase.execute(
            {
                query: req.query.q?.toString() ?? '',
                boardId: req.query.boardId?.toString() ?? '',
                limit: Number(req.query.limit) || 5,
            },
            this.presenter
        );
        return res.status(201).json(this.presenter.vm);
    }
}
