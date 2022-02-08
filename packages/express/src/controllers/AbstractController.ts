import { NextFunction, Request, Response } from 'express';
import { ApiResult } from "../../lib/types";

export abstract class AbstractController {
    abstract handle(
        req: Request,
        res: Response,
        next?: NextFunction
    ): Promise<Response>;

    getResult<T extends ApiResult<unknown>>(
        vm: T,
        res: Response,
        successCode: number = 200
    ) {
        if (vm.errors !== null) {
            return res.status(400).json(vm);
        }

        return res.status(successCode).json(vm);
    }
}
