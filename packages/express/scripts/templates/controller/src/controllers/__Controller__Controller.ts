import { __UC__Presenter, __UC__UseCase } from '@thullo/domain';
import type { __UC__PresenterAdapter, __UC__ViewModel } from '@thullo/adapters';
import type { Request, Response } from 'express';
import { container, inject, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';

@injectable()
export class __Controller__Controller extends AbstractController {
    constructor(
        @inject('__UC__Presenter') private presenter: __UC__PresenterAdapter
    ) {
        super();
    }

    // HTTP GET /api/boards
    async handle(
        req: Request,
        res: Response
    ): Promise<Response<__UC__ViewModel>> {
        const useCase = new __UC__UseCase(/*TODO : repositories & Gateways*/);

        await useCase.execute(req.body, this.presenter);
        return this.getResult(this.presenter.vm!, res);
    }
}
