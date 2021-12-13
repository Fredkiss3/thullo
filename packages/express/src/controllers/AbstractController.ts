import { NextFunction, Request, Response } from 'express';

export abstract class AbstractController {
    abstract handle(
        req: Request,
        res: Response,
        next?: NextFunction
    ): Promise<Response>;
}
