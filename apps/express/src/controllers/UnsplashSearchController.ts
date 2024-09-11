import { AbstractController } from './AbstractController';
import type { NextFunction, Response, Request } from 'express';
import { container, injectable } from 'tsyringe';
import { UnsplashGateway } from '@thullo/domain';

@injectable()
export class UnsplashSearchController extends AbstractController {
    constructor() {
        super();
    }

    // GET /api/proxy/unsplash/search?query=:query
    async handle(
        req: Request,
        res: Response,
        next?: NextFunction
    ): Promise<Response> {
        const service: UnsplashGateway = container.resolve('UnsplashGateway');
        const { query } = req.query;

        let data = null;
        let errors = null;

        if (!query) {
            errors = {
                query: ['la requête est requise'],
            };
        } else {
            data = await service.searchPhotos(query.toString());
        }

        return this.getResult(
            {
                data,
                errors,
            },
            res
        );
    }
}
