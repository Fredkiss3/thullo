import { Request, Response } from 'express';

export abstract class AbstractController {
    abstract handle(req: Request, res: Response): Promise<Response>;
}
