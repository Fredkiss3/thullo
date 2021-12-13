import { NextFunction, Request, Response } from 'express';
import { container, InjectionToken } from 'tsyringe';
import { AbstractController } from '../controllers/AbstractController';

export function getController<T extends AbstractController>(
    token: InjectionToken<T>
): (req: Request, res: Response, next?: NextFunction) => Promise<Response> {
    const controller = container.resolve(token);
    return controller.handle.bind(controller);
}
