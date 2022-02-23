import { __UC__Presenter, __UC__UseCase } from '@thullo/domain';
import { __UC__PresenterAdapter } from '@thullo/adapters';
import type { Request, Response } from 'express';
import { container, inject, injectable } from 'tsyringe';
import { AbstractController } from './AbstractController';

@injectable()
export class __Controller__Controller extends AbstractController {
    constructor(@inject('__UC__Presenter') presenter: __UC__PresenterAdapter) {
        super();
    }

    // HTTP GET /api/boards
    async handle(req: Request, res: Response): Promise<Response> {
        const useCase = new __UC__UseCase(/*TODO : repositories & Gateways*/);

        await useCase.execute(req.body, this.presenter);
        return this.getResult(this.presenter.vm!, res);
    }
}
