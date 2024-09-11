import { AbstractController } from './AbstractController';
import type { NextFunction, Response, Request } from 'express';
import { container, injectable } from 'tsyringe';
import { UnsplashGateway } from '@thullo/domain';

@injectable()
export class UnsplashListController extends AbstractController {
    constructor() {
        super();
    }

    // GET /api/proxy/unsplash/list
    async handle(
        req: Request,
        res: Response,
        next?: NextFunction
    ): Promise<Response> {
        const service: UnsplashGateway = container.resolve('UnsplashGateway');

        const data = await service.listPhotos();

        return this.getResult(
            {
                data,
                errors: null,
            },
            res
        );
    }
}
