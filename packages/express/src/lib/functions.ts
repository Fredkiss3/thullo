import jwt, { JwtPayload } from 'jsonwebtoken';
import { Member, MemberRepository } from '@thullo/domain';
import type { NextFunction, Request, Response } from 'express';
import { container, InjectionToken } from 'tsyringe';
import type { AbstractController } from '../controllers/AbstractController';
import short from 'short-uuid';

export function getController<T extends AbstractController>(
    token: InjectionToken<T>
): (req: Request, res: Response, next?: NextFunction) => Promise<Response> {
    const controller = container.resolve(token);
    return controller.handle.bind(controller);
}

export async function getUser(req: Request): Promise<Member | null> {
    const header = req.headers.authorization;
    let member: Member | null = null;

    if (header && header.startsWith('Bearer ')) {
        const token = header.split('Bearer ')[1].trim();

        try {
            // Verify the token
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET!
            ) as JwtPayload;

            // get the user from the user repository
            const repository: MemberRepository = await container.resolve(
                'MemberRepository'
            );

            member = await repository.getMemberById(short().toUUID(decoded.id));
        } catch (error) {
            // do nothing
        }
    }
    return member;
}
