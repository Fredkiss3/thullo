import { AbstractController } from './AbstractController';
import type { NextFunction, Response, Request } from 'express';
import { injectable } from "tsyringe";

// TODO : https://help.unsplash.com/en/articles/2511315-guideline-attribution
// @injectable()
export class UnsplashSearchController extends AbstractController {
    // GET /api/proxy/unsplash/search?query=:query
    async handle(
        req: Request,
        res: Response,
        next?: NextFunction
    ): Promise<Response> {
        return res.status(200).json({
            message: 'Hello from UnsplashSearchController',
        });
    }
}
